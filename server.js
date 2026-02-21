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
    const criteria = [
      'Durability', 'Feasibility', 'Reliability', 'Affordability',
      'Safety', 'Comprehensiveness', 'Marketability', 'Scalability',
      'Visibility/Adversary Notified', 'Achievable before 8 May',
      'Unwitting sender', 'Physicality', 'Complexity', 'Risk',
      'Impact', 'Repeatable'
    ];
    const defaultStructure = {
      criteria,
      weights: evenWeights(criteria.length),
      projects: [
        { name: 'Air-Quench Chemical Seal', description: 'Light-emitting chemical seal that permanently "quenches" if exposed to air.' },
        { name: 'Light-Reactive Packaging', description: 'Material packaging that reacts to exposure to light' },
        { name: 'Magnetic Impact Record', description: 'Uses magnetic particle orientation to freeze a physical record of handling and impacts.' },
        { name: 'Internal Photodetector Sensor', description: 'Photodetector inside cargo packaging detects opening' },
        { name: 'Alkali Vapor Resonance Tag', description: "A microscopic vial of alkali vapor that oxidizes upon seal breach, permanently altering the package's magnetic resonance for forensic verification." },
        { name: 'Laser Micropattern Rugged Seals', description: 'Rugged seals to be placed upon package seams; each seal with a unique microscopic reflective pattern that is revealed with a laser and damaged when tampered.' },
        { name: 'Tamper-Evident Mimic Tape', description: 'Commercially available or specially produced tamper tape designed to look like normal packing tape with tamper evident properties.' },
        { name: 'Air-Corrosion Timestamp Battery', description: 'A chemical "battery" that only begins to corrode when exposed to external air, creating a forensic timestamp of the exact moment a seal was broken.' },
        { name: 'Bacterial Color-Shift Coating', description: 'A light-sensitive bacterial coating applied to cargo that permanently changes color if the container is opened prematurely.' },
        { name: 'DNA Dust Breach Canister', description: 'A pressurized canister that releases a fine, synthetic DNA dust upon breach, providing an un-washable forensic marker on the intruder and their vehicle.' },
        { name: 'Alkali Vapor Resonance Tag (Variant)', description: "A microscopic vial of alkali vapor that oxidizes upon seal breach, permanently altering the package's magnetic resonance for forensic verification." },
        { name: 'Invisible DNA Authentication Coating', description: 'Invisible coating of DNA that provides authentication' },
        { name: 'Nonvisible Signature Paint', description: 'Container or package is painted with signature pattern in nonvisible wavelength' },
        { name: 'Off-Gassing Chemical Taggant', description: 'A chemical taggant\'s unique signature is detectable via off-gassing.' },
        { name: 'Stable Isotope Air-Exchange Monitor', description: 'Monitors stable isotope ratios to detect geographic air exchange during breaches.' },
        { name: 'Pressure-Gas Rigid Packaging Monitor', description: 'Use of rigid packaging alongside precise pressure and gas concentration measurements to detect unsealing and re-sealing of packages.' },
        { name: 'Embedded Tamper Camera', description: 'Embedded camera detects tamper events' },
        { name: 'Passive Long-Range RFID Loop', description: 'Long-range or satellite-activated RFID loop hidden inside cardboard box packaging; consumes no energy' },
        { name: 'Acoustic Tamper Microphone', description: 'Active on-board microphone detects sounds akin to cargo tampering depending on frequencies and amplitudes.' },
        { name: 'Internal Motion IMU Logger', description: 'An internal motion sensor (IMU) records abnormal movement patterns consistent with forced entry.' },
        { name: 'Fiber-Optic Seam Loop Sensor', description: 'A fiber-optic loop (or strain sensor) embedded in the door seam or container detects tampering through signal interruption.' },
        { name: 'Conductivity Disturbance Sensor', description: 'A sensor monitors disturbances in the electrical conductivity of a package wrapper.' },
        { name: 'Piezoelectric Breach Tape', description: 'Piezoelectric tape that seals the package and harvests energy from being torn to send a final breach signal.' },
        { name: 'Cryptographic Lock Audit Trail', description: 'Cryptographic digital handshake required to open a lock. Unauthorized opening or cutting results in event being logged into an immutable digital audit trail.' },
        { name: 'Destination Sensor Hash Check', description: 'Container sensor state hash is verified at destination to detect alteration.' },
        { name: 'Muon Tomography Mapping', description: 'Uses muon tomography to create 3D density maps of cargo without opening packaging.' },
        { name: 'Ultrasonic Seal Disruption Detection', description: 'Ultrasonic signals detect seal disruption without opening the container.' },
        { name: 'THz Internal Fingerprint Scan', description: 'Identifies internal chemical/component fingerprints through packaging using THz waves.' },
        { name: 'Interval Neutristor Detection', description: 'A Neutristor (compact neutron generator) fires at preset intervals, allowing detection at distance.' },
        { name: 'UWB Structural-Change Mesh', description: 'Creates a spatial ultra-wide band mesh to detect centimeters of structural change or movement.' },
        { name: 'Luneberg Lens EM Signature', description: 'An array of Luneberg lenses provides a signature EMR reflection pattern' },
        { name: 'Seam Geometry Drift Scanner', description: 'Scanning tool that determines if seam geometry shows signs of suspicious patterns, frays, or alignment drifts that may indicate tampering.' },
        { name: 'Resonance Shift Detector', description: 'Measures "tuning fork" resonance shifts in container bracing to detect cargo removal as the container\'s natural frequency changes.' },
        { name: 'Ambient RF Shared-Key Detection', description: 'Uses ambient RF noise as a shared cryptographic key to detect item displacement.' },
        { name: 'Parasitic Network Reporting Node', description: 'Embedded node that parasitically connects to WAPs, IoT devices, etc. and reports location/time.' },
        { name: 'Ultrasonic Covert Exfiltration Layer', description: 'A covert software layer that encodes location data into ultrasonic pulses, exfiltrating status through the cargo hull to nearby mobile devices without using RF.' },
        { name: 'Fake Tracking-ID Deception Platform', description: 'A deception-based platform that generates dozens of fake tracking IDs to mask the true metadata and location of the sensitive shipment from adversaries.' },
        { name: 'Maritime Acoustic Position Assurance', description: 'Leverage existing maritime acoustic assets to ensure real-time positioning across contested waters and prevent AIS denial.' },
        { name: 'Carrier-Phase Spoof Detection', description: 'An internal receiver that logs satellite carrier-phase data to detect if the cargo was moved into a spoofed or "simulated" sovereign transport environment.' },
        { name: 'Satellite+OSINT Tamper Prediction AI', description: 'An AI model that predicts tampering likelihood by fusing live satellite imagery with open-source shipping data.' },
        { name: 'Satellite Computer Vision Tracking', description: 'Computer vision models ingest satellite data to track ships and packages.' },
        { name: 'AI Appearance-Change Analysis', description: 'AI-assisted image analysis of changes in package appearance from origin to destination in order to distinguish normal transit wear from suspicious tampering.' },
        { name: 'HazMat Concealment Recommender', description: 'Algorithmic solution that recommends procedures for concealing target packages within international HazMat supply chains that have high-fidelity chain-of-custody and low instances of tampering.' },
        { name: 'Self-Heating Neutralizer', description: 'A chemical heating element that triggers during unauthorized access to raise internal temperatures to 80C, rendering sensitive components unusable.' },
        { name: 'True-and-Decoy Shipment Strategy', description: 'Solution that sends the "true" package alongside several similar "false" packages to confuse adversaries, better reveal one-off tampering, and disincentivize future shipment interference.' }
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
