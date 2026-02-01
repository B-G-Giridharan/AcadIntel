"""
Demo textbook content and questions database
This simulates a real textbook ingestion system
"""

QUANTUM_PHYSICS_TEXTBOOK = {
    "title": "Introduction to Quantum Mechanics",
    "author": "David J. Griffiths",
    "isbn": "978-1107179868",
    "edition": "3rd Edition",
    "chapters": [
        {
            "number": 1,
            "title": "The Wave Function",
            "sections": [
                {
                    "title": "Quantum Superposition",
                    "content": """The principle of superposition is a fundamental concept in quantum mechanics. 
                    It states that when two or more quantum states are possible, the actual state is a 
                    superposition (combination) of all possible states until a measurement is made. 
                    
                    The wave function psi(x,t) contains all information about the quantum state. When measured, 
                    the wave function collapses to a single eigenstate. The probability of finding a particle 
                    at position x is given by |psi(x,t)|^2.
                    
                    Key points:
                    1. Multiple states can exist simultaneously
                    2. Measurement causes wave function collapse
                    3. Probability is determined by wave function amplitude squared
                    4. Superposition is destroyed upon observation""",
                    "key_terms": ["superposition", "wave function", "measurement", "collapse"],
                    "page": 12
                },
                {
                    "title": "Heisenberg Uncertainty Principle",
                    "content": """The Heisenberg Uncertainty Principle is a fundamental limitation in quantum mechanics 
                    that states we cannot simultaneously know both the exact position and exact momentum of a particle.
                    
                    Mathematical formulation: Delta x * Delta p >= hbar/2
                    
                    Where:
                    - Delta x is the uncertainty in position
                    - Delta p is the uncertainty in momentum
                    - hbar is the reduced Planck constant (h/2pi)
                    
                    This is not due to measurement limitations, but rather a fundamental property of nature. 
                    The more precisely we know position, the less precisely we can know momentum, and vice versa.
                    
                    Applications:
                    1. Explains stability of atoms
                    2. Sets limits on measurement precision
                    3. Fundamental to quantum field theory
                    4. Basis for quantum cryptography""",
                    "key_terms": ["uncertainty principle", "position", "momentum", "Planck constant"],
                    "page": 24
                }
            ]
        },
        {
            "number": 2,
            "title": "The Schrödinger Equation",
            "sections": [
                {
                    "title": "Time-Independent Schrödinger Equation",
                    "content": """The time-independent Schrödinger equation is the fundamental equation for 
                    stationary quantum states:
                    
                    H_hat * psi = E * psi
                    
                    Or in expanded form: -(hbar^2)/(2m) * d^2 psi/dx^2 + V(x) * psi = E * psi
                    
                    Where:
                    - H_hat is the Hamiltonian operator (total energy)
                    - psi is the wave function
                    - E is the energy eigenvalue
                    - V(x) is the potential energy
                    - m is the particle mass
                    
                    This equation allows us to find allowed energy levels and corresponding wave functions 
                    for quantum systems. Solutions must be:
                    1. Continuous
                    2. Single-valued
                    3. Normalizable
                    4. Smooth (continuous first derivative)
                    
                    Common applications:
                    - Particle in a box
                    - Harmonic oscillator
                    - Hydrogen atom
                    - Quantum tunneling""",
                    "key_terms": ["Schrödinger equation", "Hamiltonian", "eigenvalue", "wave function"],
                    "page": 45
                }
            ]
        }
    ]
}

MACHINE_LEARNING_TEXTBOOK = {
    "title": "Pattern Recognition and Machine Learning",
    "author": "Christopher M. Bishop",
    "isbn": "978-0387310732",
    "edition": "1st Edition",
    "chapters": [
        {
            "number": 1,
            "title": "Introduction to Machine Learning",
            "sections": [
                {
                    "title": "Supervised Learning",
                    "content": """Supervised learning is a machine learning paradigm where the algorithm learns 
                    from labeled training data. The goal is to learn a mapping from inputs to outputs based on 
                    example input-output pairs.
                    
                    Types of supervised learning:
                    1. Classification - predicting discrete labels
                       Examples: spam detection, image recognition
                    
                    2. Regression - predicting continuous values
                       Examples: price prediction, temperature forecasting
                    
                    The learning process:
                    1. Collect labeled training data (X, y)
                    2. Choose a model/hypothesis class
                    3. Define a loss function
                    4. Optimize model parameters to minimize loss
                    5. Evaluate on test data
                    
                    Common algorithms:
                    - Linear regression
                    - Logistic regression
                    - Decision trees
                    - Support Vector Machines (SVM)
                    - Neural networks""",
                    "key_terms": ["supervised learning", "classification", "regression", "training data"],
                    "page": 18
                },
                {
                    "title": "Overfitting and Regularization",
                    "content": """Overfitting occurs when a model learns the training data too well, including 
                    noise and outliers, resulting in poor generalization to new data.
                    
                    Signs of overfitting:
                    1. High accuracy on training data
                    2. Poor accuracy on test/validation data
                    3. Model is too complex for the amount of data
                    
                    Regularization techniques to prevent overfitting:
                    
                          1. L1 Regularization (Lasso):
                              Loss = MSE + lambda * sum |w_i|
                       Produces sparse models (some weights = 0)
                    
                          2. L2 Regularization (Ridge):
                              Loss = MSE + lambda * sum w_i^2
                       Shrinks weights uniformly
                    
                    3. Dropout (for neural networks):
                       Randomly deactivate neurons during training
                    
                    4. Early stopping:
                       Stop training when validation error starts increasing
                    
                    5. Data augmentation:
                       Artificially increase training data
                    
                    The regularization parameter lambda controls the trade-off between fitting the training 
                    data and keeping the model simple.""",
                    "key_terms": ["overfitting", "regularization", "L1", "L2", "dropout"],
                    "page": 34
                }
            ]
        }
    ]
}

DEMO_QUESTIONS = {
    "Quantum Physics I": [
        {
            "id": "qp1",
            "text": "Explain the principle of quantum superposition with examples.",
            "year": 2023,
            "exam": "Final Exam",
            "weightage": 10,
            "frequency": 3,  # Appeared 3 times in past papers
            "difficulty": "Medium",
            "topics": ["Wave Function", "Quantum Superposition"]
        },
        {
            "id": "qp2",
            "text": "Derive and explain the Heisenberg Uncertainty Principle.",
            "year": 2023,
            "exam": "Final Exam",
            "weightage": 15,
            "frequency": 5,  # High frequency - important question
            "difficulty": "High",
            "topics": ["Heisenberg Uncertainty Principle"]
        },
        {
            "id": "qp3",
            "text": "What is the Heisenberg Uncertainty Principle? Discuss its implications.",
            "year": 2022,
            "exam": "Midterm",
            "weightage": 10,
            "frequency": 5,  # Repeated question (similar to qp2)
            "difficulty": "Medium",
            "topics": ["Heisenberg Uncertainty Principle"]
        },
        {
            "id": "qp4",
            "text": "Solve the time-independent Schrödinger equation for a particle in a box.",
            "year": 2023,
            "exam": "Final Exam",
            "weightage": 20,
            "frequency": 4,
            "difficulty": "High",
            "topics": ["Schrödinger Equation"]
        },
        {
            "id": "qp5",
            "text": "Describe wave function collapse and measurement in quantum mechanics.",
            "year": 2022,
            "exam": "Quiz",
            "weightage": 5,
            "frequency": 2,
            "difficulty": "Low",
            "topics": ["Wave Function", "Measurement"]
        },
        {
            "id": "qp6",
            "text": "Explain quantum superposition and provide real-world examples.",
            "year": 2021,
            "exam": "Final Exam",
            "weightage": 10,
            "frequency": 3,  # Repeated question (similar to qp1)
            "difficulty": "Medium",
            "topics": ["Quantum Superposition"]
        }
    ],
    "Machine Learning": [
        {
            "id": "ml1",
            "text": "What is supervised learning? Explain with examples.",
            "year": 2023,
            "exam": "Final Exam",
            "weightage": 10,
            "frequency": 4,
            "difficulty": "Low",
            "topics": ["Supervised Learning"]
        },
        {
            "id": "ml2",
            "text": "Explain overfitting and discuss regularization techniques to prevent it.",
            "year": 2023,
            "exam": "Final Exam",
            "weightage": 15,
            "frequency": 5,
            "difficulty": "High",
            "topics": ["Overfitting", "Regularization"]
        },
        {
            "id": "ml3",
            "text": "Compare L1 and L2 regularization methods.",
            "year": 2022,
            "exam": "Midterm",
            "weightage": 10,
            "frequency": 3,
            "difficulty": "Medium",
            "topics": ["Regularization"]
        },
        {
            "id": "ml4",
            "text": "What causes overfitting in machine learning models? How can it be prevented?",
            "year": 2022,
            "exam": "Quiz",
            "weightage": 10,
            "frequency": 5,  # Repeated question (similar to ml2)
            "difficulty": "Medium",
            "topics": ["Overfitting"]
        }
    ]
}

def get_demo_textbook(subject_name: str):
    """Get demo textbook for a subject"""
    if "Quantum" in subject_name or "Physics" in subject_name:
        return QUANTUM_PHYSICS_TEXTBOOK
    elif "Machine Learning" in subject_name or "ML" in subject_name:
        return MACHINE_LEARNING_TEXTBOOK
    else:
        # Default to Quantum Physics
        return QUANTUM_PHYSICS_TEXTBOOK

def get_demo_questions(subject_name: str):
    """Get demo questions for a subject"""
    if "Quantum" in subject_name or "Physics" in subject_name:
        return DEMO_QUESTIONS["Quantum Physics I"]
    elif "Machine Learning" in subject_name or "ML" in subject_name:
        return DEMO_QUESTIONS["Machine Learning"]
    else:
        return DEMO_QUESTIONS["Quantum Physics I"]
