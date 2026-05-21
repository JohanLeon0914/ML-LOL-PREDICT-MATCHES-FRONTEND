import fs from "fs";
import path from "path";

const sectionsNavEs = {
  overview: "1. Introducción",
  objective: "2. Objetivo del Proyecto",
  dataset: "3. Dataset",
  pipeline: "4. Pipeline de Datos",
  leakage: "5. Prevención de Data Leakage",
  features: "6. Feature Engineering",
  architecture: "7. Arquitectura del Modelo",
  embeddings: "8. Embeddings de Campeones",
  roles: "9. Role Encoders",
  interactions: "10. Pairwise Interactions",
  numeric: "11. Rama Numérica",
  gate: "12. Dynamic Gating",
  training: "13. Entrenamiento",
  regularization: "14. Regularización",
  results: "15. Resultados",
  deployment: "16. Deployment y API",
  frontend: "17. Frontend Web",
  future: "18. Futuras Mejoras",
  conclusion: "19. Conclusión",
};

const sectionsNavEn = {
  overview: "1. Introduction",
  objective: "2. Project Objective",
  dataset: "3. Dataset",
  pipeline: "4. Data Pipeline",
  leakage: "5. Data Leakage Prevention",
  features: "6. Feature Engineering",
  architecture: "7. Model Architecture",
  embeddings: "8. Champion Embeddings",
  roles: "9. Role Encoders",
  interactions: "10. Pairwise Interactions",
  numeric: "11. Numeric Branch",
  gate: "12. Dynamic Gating",
  training: "13. Training",
  regularization: "14. Regularization",
  results: "15. Results",
  deployment: "16. Deployment & API",
  frontend: "17. Web Frontend",
  future: "18. Future Improvements",
  conclusion: "19. Conclusion",
};

const es = {
  meta: {
    title: "Documentación - Red Neuronal LoL",
    description:
      "Documentación técnica completa del modelo de predicción de partidas competitivas de League of Legends.",
  },
  toc: {
    title: "Índice de Contenido",
    description:
      "Documentación técnica completa del sistema de predicción de partidas competitivas de League of Legends.",
    ariaLabel: "Índice de la documentación",
  },
  sectionsNav: sectionsNavEs,
  hero: {
    badge: "Machine Learning • PyTorch • Esports Analytics",
    title:
      "Red Neuronal para Predicción de Partidas Competitivas de League of Legends",
    description:
      "Sistema de machine learning end-to-end desarrollado en PyTorch para predecir resultados de partidas profesionales de League of Legends utilizando embeddings de campeones, estadísticas históricas, matchups, sinergias y arquitectura híbrida con dynamic gating.",
    bestBaseline: "Mejor Baseline",
  },
  overview: {
    p1: "Este proyecto consiste en un sistema de machine learning diseñado para predecir resultados de partidas competitivas profesionales de League of Legends utilizando datos históricos de esports entre 2023 y 2026.",
    p2: "El objetivo principal del modelo es aprender patrones complejos relacionados con drafts competitivos, matchups entre campeones, rendimiento histórico de jugadores y equipos, sinergias entre picks y tendencias recientes del metagame.",
    p3: "El sistema fue desarrollado utilizando PyTorch y una arquitectura híbrida dual que combina embeddings entrenables de campeones con una rama numérica de estadísticas históricas avanzadas.",
  },
  objective: {
    p1: "El objetivo de este proyecto no era únicamente entrenar un modelo con buena accuracy, sino construir un sistema de predicción competitivo completo capaz de:",
    items: [
      "Predecir resultados de partidas profesionales.",
      "Manejar campeones nuevos añadidos al juego.",
      "Evitar data leakage temporal.",
      "Generalizar entre distintos patches y metas.",
      "Desplegar inferencia en producción mediante API.",
      "Consumir el modelo desde una interfaz web moderna.",
    ],
  },
  dataset: {
    p1: "El dataset utilizado proviene de partidas profesionales de múltiples ligas competitivas internacionales.",
    leaguesTitle: "Ligas Utilizadas",
    featuresTitle: "Features Base",
    features: [
      "Picks",
      "Bans",
      "Jugadores",
      "Equipos",
      "Resultado",
      "Fecha",
      "First Pick",
      "Winrates históricos",
    ],
  },
  pipeline: {
    p1: "El pipeline de procesamiento fue diseñado para simular un entorno real de predicción temporal.",
    flow: "Raw Matches → Cleaning → Feature Engineering → Scaling → Encoding → Tensors → Neural Network",
    p2: "Todos los datos fueron ordenados cronológicamente antes de generar estadísticas históricas para evitar contaminación futura.",
  },
  leakage: {
    p1: "Uno de los problemas más importantes en modelos deportivos es el data leakage temporal.",
    p2: "Para evitarlo, todas las estadísticas históricas fueron calculadas utilizando únicamente información previa a cada partida.",
    solvedTitle: "Problemas de ML Resueltos",
    solved: [
      "Temporal Data Leakage",
      "OOD Champions",
      "Sparse Embeddings",
      "Dynamic Feature Weighting",
      "Time-aware Splits",
      "Overfitting",
    ],
  },
  features: {
    p1: "El feature engineering representa uno de los componentes más importantes del proyecto.",
    historicalTitle: "Features Históricas",
    strategicTitle: "Features Estratégicas",
    historical: [
      "Player Winrate",
      "Player Recent Winrate",
      "Champion Winrate",
      "Team Winrate",
      "Team Recent Form",
    ],
    strategic: [
      "Matchups por rol",
      "Synergies",
      "Role Synergies",
      "Head-to-Head",
      "First Pick Advantage",
    ],
  },
  architecture: {
    p1: "El modelo utiliza una arquitectura híbrida dual compuesta por:",
    items: [
      "Rama de embeddings de campeones.",
      "Rama numérica de estadísticas históricas.",
      "Mecanismo de dynamic gating.",
      "Fully connected prediction head.",
    ],
  },
  embeddings: {
    p1: "Cada campeón es representado mediante un embedding entrenable de dimensión 16.",
    p2: "El uso de embeddings permite que el modelo aprenda relaciones semánticas entre campeones similares y capture patrones complejos del metagame competitivo.",
  },
  roles: {
    p1: "Para cada rol competitivo, el modelo genera representaciones individuales utilizando la diferencia entre embeddings enfrentados.",
    p2: "Esto permite modelar ventajas relativas entre picks específicos dentro de cada línea competitiva.",
  },
  interactions: {
    p1: "El modelo calcula interacciones pairwise entre roles para capturar sinergias complejas entre composiciones.",
    p2: "Esto permite aprender relaciones como:",
    items: [
      "Mid + Jungle synergy",
      "Bot + Support coordination",
      "Frontline + Backline balance",
    ],
  },
  numeric: {
    p1: "La rama numérica procesa estadísticas históricas escaladas utilizando StandardScaler.",
    p2: "Esta rama es especialmente importante para manejar campeones nuevos o picks raros que no aparecen frecuentemente durante entrenamiento.",
  },
  gate: {
    p1: "El gate fue diseñado para resolver el problema de campeones nuevos y datos sparse.",
    p2: "El mecanismo aprende dinámicamente cuánto confiar en embeddings y cuánto confiar en estadísticas numéricas dependiendo del contexto de la partida.",
  },
  training: {
    p1: "El modelo fue entrenado utilizando BCEWithLogitsLoss y el optimizador Adam.",
  },
  regularization: {
    p1: "Se aplicaron múltiples técnicas de regularización para mejorar generalización y reducir overfitting.",
    items: [
      "Dropout agresivo sobre embeddings.",
      "LayerNorm en múltiples bloques.",
      "Weight Decay.",
      "Early Stopping.",
      "Learning Rate Scheduling.",
    ],
  },
  results: {
    p1: "El modelo supera significativamente a todos los baselines tradicionales basados únicamente en winrates.",
    modelCol: "Modelo",
    accuracyCol: "Accuracy",
    baselineRow: "Baseline WR",
    nnRow: "Neural Network",
  },
  deployment: {
    p1: "El modelo fue exportado y desplegado mediante una API para inferencia en tiempo real.",
    items: [
      "PyTorch Model Serialization",
      "REST API",
      "Model Metadata",
      "Historical Stats Persistence",
      "Cloud Deployment",
    ],
  },
  frontend: {
    p1: "Actualmente el proyecto también incluye el desarrollo de una interfaz web moderna para consumir la API del modelo.",
    p2: "El frontend permite:",
    items: [
      "Seleccionar drafts competitivos.",
      "Visualizar probabilidades de victoria.",
      "Consumir inferencia en tiempo real.",
      "Mostrar métricas y estadísticas.",
      "Presentar documentación técnica.",
    ],
  },
  future: {
    items: [
      "Predicciones calibradas.",
      "SHAP / Explainability.",
      "Live Draft Prediction.",
      "Patch-aware Training.",
      "Transformers / GNNs.",
      "MLflow Tracking.",
    ],
  },
  conclusion: {
    p1: "Este proyecto implementa un sistema completo de machine learning end-to-end para predicción de partidas competitivas de League of Legends.",
    p2: "La combinación de feature engineering avanzado, embeddings, interacciones entre roles y dynamic gating permite capturar patrones complejos del metagame competitivo y superar ampliamente modelos baseline tradicionales.",
    p3: "Además del modelo en sí, el proyecto también cubre deployment, APIs y frontend web, convirtiéndolo en un sistema ML completo orientado a producción.",
  },
};

const en = JSON.parse(JSON.stringify(es));
en.meta = {
  title: "Documentation - LoL Neural Network",
  description:
    "Complete technical documentation for the competitive League of Legends match prediction model.",
};
en.toc = {
  title: "Table of Contents",
  description:
    "Complete technical documentation for the competitive League of Legends match prediction system.",
  ariaLabel: "Documentation table of contents",
};
en.sectionsNav = sectionsNavEn;
en.hero = {
  badge: "Machine Learning • PyTorch • Esports Analytics",
  title: "Neural Network for Competitive League of Legends Match Prediction",
  description:
    "End-to-end machine learning system built with PyTorch to predict professional League of Legends match outcomes using champion embeddings, historical stats, matchups, synergies, and a hybrid architecture with dynamic gating.",
  bestBaseline: "Best Baseline",
};
en.overview = {
  p1: "This project is a machine learning system designed to predict outcomes of professional competitive League of Legends matches using historical esports data from 2023 to 2026.",
  p2: "The model's main goal is to learn complex patterns related to competitive drafts, champion matchups, historical player and team performance, pick synergies, and recent metagame trends.",
  p3: "The system was built with PyTorch and a dual hybrid architecture that combines trainable champion embeddings with a numeric branch of advanced historical statistics.",
};
en.objective = {
  p1: "This project's goal was not only to train a model with good accuracy, but to build a complete competitive prediction system capable of:",
  items: [
    "Predicting professional match outcomes.",
    "Handling newly released champions.",
    "Avoiding temporal data leakage.",
    "Generalizing across patches and metas.",
    "Deploying inference in production via API.",
    "Consuming the model from a modern web interface.",
  ],
};
en.dataset = {
  p1: "The dataset comes from professional matches across multiple international competitive leagues.",
  leaguesTitle: "Leagues Used",
  featuresTitle: "Base Features",
  features: [
    "Picks",
    "Bans",
    "Players",
    "Teams",
    "Result",
    "Date",
    "First Pick",
    "Historical winrates",
  ],
};
en.pipeline = {
  p1: "The processing pipeline was designed to simulate a real temporal prediction environment.",
  flow: "Raw Matches → Cleaning → Feature Engineering → Scaling → Encoding → Tensors → Neural Network",
  p2: "All data was sorted chronologically before generating historical statistics to avoid future contamination.",
};
en.leakage = {
  p1: "One of the most important issues in sports models is temporal data leakage.",
  p2: "To prevent it, all historical statistics were computed using only information prior to each match.",
  solvedTitle: "ML Problems Solved",
  solved: en.leakage.solved,
};
en.features = {
  p1: "Feature engineering is one of the most important components of the project.",
  historicalTitle: "Historical Features",
  strategicTitle: "Strategic Features",
  historical: en.features.historical,
  strategic: [
    "Role matchups",
    "Synergies",
    "Role Synergies",
    "Head-to-Head",
    "First Pick Advantage",
  ],
};
en.architecture = {
  p1: "The model uses a dual hybrid architecture composed of:",
  items: [
    "Champion embedding branch.",
    "Numeric branch of historical statistics.",
    "Dynamic gating mechanism.",
    "Fully connected prediction head.",
  ],
};
en.embeddings = {
  p1: "Each champion is represented by a trainable embedding of dimension 16.",
  p2: "Embeddings let the model learn semantic relationships between similar champions and capture complex competitive metagame patterns.",
};
en.roles = {
  p1: "For each competitive role, the model generates individual representations using the difference between opposing embeddings.",
  p2: "This models relative advantages between specific picks within each competitive lane.",
};
en.interactions = en.interactions;
en.numeric = {
  p1: "The numeric branch processes scaled historical statistics using StandardScaler.",
  p2: "This branch is especially important for handling new champions or rare picks that rarely appear during training.",
};
en.gate = {
  p1: "The gate was designed to address new champions and sparse data.",
  p2: "The mechanism dynamically learns how much to trust embeddings versus numeric statistics depending on match context.",
};
en.training = {
  p1: "The model was trained using BCEWithLogitsLoss and the Adam optimizer.",
};
en.regularization = {
  p1: "Multiple regularization techniques were applied to improve generalization and reduce overfitting.",
  items: [
    "Aggressive dropout on embeddings.",
    "LayerNorm in multiple blocks.",
    "Weight Decay.",
    "Early Stopping.",
    "Learning Rate Scheduling.",
  ],
};
en.results = {
  p1: "The model significantly outperforms all traditional winrate-only baselines.",
  modelCol: "Model",
  accuracyCol: "Accuracy",
  baselineRow: "Baseline WR",
  nnRow: "Neural Network",
};
en.deployment = {
  p1: "The model was exported and deployed via an API for real-time inference.",
  items: en.deployment.items,
};
en.frontend = {
  p1: "The project also includes a modern web interface to consume the model API.",
  p2: "The frontend allows:",
  items: [
    "Selecting competitive drafts.",
    "Viewing win probabilities.",
    "Real-time inference.",
    "Displaying metrics and statistics.",
    "Presenting technical documentation.",
  ],
};
en.future = {
  items: [
    "Calibrated predictions.",
    "SHAP / Explainability.",
    "Live Draft Prediction.",
    "Patch-aware Training.",
    "Transformers / GNNs.",
    "MLflow Tracking.",
  ],
};
en.conclusion = {
  p1: "This project implements a complete end-to-end machine learning system for competitive League of Legends match prediction.",
  p2: "The combination of advanced feature engineering, embeddings, role interactions, and dynamic gating captures complex competitive metagame patterns and far exceeds traditional baseline models.",
  p3: "Beyond the model itself, the project also covers deployment, APIs, and a web frontend, making it a production-oriented complete ML system.",
};

const root = path.join(import.meta.dirname, "..");
fs.writeFileSync(
  path.join(root, "messages/es/docs.json"),
  JSON.stringify(es, null, 2)
);
fs.writeFileSync(
  path.join(root, "messages/en/docs.json"),
  JSON.stringify(en, null, 2)
);
console.log("Generated docs messages");
