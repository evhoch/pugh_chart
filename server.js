const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const STRUCTURE_FILE = path.join(DATA_DIR, 'structure.json');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function evenWeights(n) {
  if (n === 0) return [];
  const base = Math.floor(100 / n);
  const remainder = 100 - base * n;
  return Array.from({ length: n }, (_, i) => (base + (i < remainder ? 1 : 0)) / 100);
}

function readStructure() {
  ensureDataDir();
  if (!fs.existsSync(STRUCTURE_FILE)) {
    const criteria = ['Cost', 'Performance', 'Ease of use'];
    const defaultStructure = {
      criteria,
      weights: evenWeights(criteria.length),
      projects: [
        { name: 'Project A', description: '' },
        { name: 'Project B', description: '' },
        { name: 'Project C', description: '' }
      ]
    };
    fs.writeFileSync(STRUCTURE_FILE, JSON.stringify(defaultStructure, null, 2));
    return defaultStructure;
  }
  return JSON.parse(fs.readFileSync(STRUCTURE_FILE, 'utf8'));
}

function writeStructure(structure) {
  ensureDataDir();
  fs.writeFileSync(STRUCTURE_FILE, JSON.stringify(structure, null, 2));
}

function readSubmissions() {
  ensureDataDir();
  if (!fs.existsSync(SUBMISSIONS_FILE)) return [];
  return JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf8'));
}

function writeSubmissions(submissions) {
  ensureDataDir();
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));
}

app.get('/api/structure', (req, res) => {
  try {
    res.json(readStructure());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/structure', (req, res) => {
  try {
    const { type, name, description } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required' });
    const structure = readStructure();
    if (type === 'criterion') {
      if (structure.criteria.includes(name.trim())) return res.status(400).json({ error: 'Criterion already exists' });
      structure.criteria.push(name.trim());
      structure.weights.push(0);
    } else if (type === 'project') {
      if (structure.projects.some(p => p.name === name.trim())) return res.status(400).json({ error: 'Project already exists' });
      structure.projects.push({ name: name.trim(), description: (description || '').trim() });
    } else {
      return res.status(400).json({ error: 'Type must be "criterion" or "project"' });
    }
    writeStructure(structure);
    res.json(structure);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/weights', (req, res) => {
  try {
    const { weights } = req.body;
    if (!Array.isArray(weights)) return res.status(400).json({ error: 'weights must be an array' });
    const parsed = weights.map(w => Math.round((Number(w) || 0) * 100) / 100);
    const sum = Math.round(parsed.reduce((s, v) => s + v, 0) * 100) / 100;
    if (Math.abs(sum - 1) >= 0.01) return res.status(400).json({ error: 'Weights must sum to 1.00 (currently ' + sum.toFixed(2) + ')' });
    const structure = readStructure();
    structure.weights = parsed;
    writeStructure(structure);
    res.json(structure);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// scores format: { projectIndex: { criterionIndex: +1|0|-1 } }
app.post('/api/submit', (req, res) => {
  try {
    const { userName, scores } = req.body;
    if (!userName || !userName.trim()) return res.status(400).json({ error: 'Name is required' });
    const submissions = readSubmissions();
    const existing = submissions.findIndex(s => s.userName.trim().toLowerCase() === userName.trim().toLowerCase());
    const submission = { userName: userName.trim(), scores: scores || {}, submittedAt: new Date().toISOString() };
    if (existing >= 0) submissions[existing] = submission;
    else submissions.push(submission);
    writeSubmissions(submissions);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/submissions', (req, res) => {
  try {
    res.json({ structure: readStructure(), submissions: readSubmissions() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/aggregate', (req, res) => {
  try {
    const structure = readStructure();
    const submissions = readSubmissions();
    const { criteria, weights, projects } = structure;
    const n = submissions.length;

    const results = projects.map((proj, pIdx) => {
      let raters = 0;
      submissions.forEach(sub => {
        if ((sub.scores || {})[pIdx]) raters++;
      });

      const criterionAvgs = criteria.map((_, cIdx) => {
        if (raters === 0) return 0;
        let sum = 0;
        submissions.forEach(sub => {
          const pScores = (sub.scores || {})[pIdx];
          if (!pScores) return;
          const raw = Number(pScores[cIdx]) || 0;
          sum += Math.max(-1, Math.min(1, raw));
        });
        return sum / raters;
      });

      let weightedScore = 0;
      criterionAvgs.forEach((avg, cIdx) => {
        weightedScore += avg * (Number(weights[cIdx]) || 0);
      });

      return {
        project: proj.name,
        description: proj.description || '',
        criterionAvgs,
        weightedScore: Math.round(weightedScore * 1000) / 1000,
        raters
      };
    });

    results.sort((a, b) => b.weightedScore - a.weightedScore);
    const ranking = results.map((row, i) => ({ rank: i + 1, ...row }));

    res.json({ structure, ranking, submissionsCount: n });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Pugh chart app running at http://localhost:${PORT}`);
});
