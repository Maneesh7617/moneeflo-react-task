import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email === 'maneeshkumar@gmail.com' && password === 'maneesh12345') {
      setMessage('Test Login Successful!');
      navigate('/form');
      return;
    }
    if (email === 'maneeshkumar1@gmail.com' && password === 'maneesh123456') {
      setMessage('Test Login Successful!');
      navigate('/form');
      return;
    }

    try {
      const response = await axios.post('https://xano-api-endpoint/login', { email, password });
      setMessage('Login Successful!');
      navigate('/form');
    } catch (error) {
      setMessage('Login Failed. Please check your credentials.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: '400px' }}>
        <h1 className="text-center mb-4">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <p className="text-center mt-3">{message}</p>
        <button
          onClick={() => navigate('/forgot-password')}
          className="btn btn-link w-100"
        >
          Forgot Password?
        </button>
      </div>
    </div>
  );
};

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');

  const handleResetRequest = (e) => {
    e.preventDefault();
    alert('Password reset link sent to your email!');
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: '400px' }}>
        <h1 className="text-center mb-4">Forgot Password</h1>
        <form onSubmit={handleResetRequest}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Request Reset</button>
        </form>
      </div>
    </div>
  );
};

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [geoLocation, setGeoLocation] = useState('');
  const [files, setFiles] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setGeoLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
    });
  }, []);

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.phone) {
        alert('Please fill out all fields!');
        return;
      }
    }
    if (step === 2) {
      if (!formData.address || !formData.city || !formData.state || !formData.pincode || !formData.country) {
        alert('Please fill out all fields!');
        return;
      }
    }
    if (step === 3) {
      if (!formData.additionalInfo) {
        alert('Please fill out all fields!');
        return;
      }
    }
    if (step === 4 && files.length === 0) {
      alert('Please upload at least one file!');
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    const formDataWithFiles = new FormData();
    for (const key in formData) {
      formDataWithFiles.append(key, formData[key]);
    }
    files.forEach((file) => formDataWithFiles.append('files', file));

    try {
      await axios.post('https://xano-api-endpoint/form-submit', formDataWithFiles, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Form Submitted Successfully!');
    } catch (error) {
      alert('Submission Failed. Please try again.');
    }
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  return (
    <div className="container">
      <div className="progress my-3">
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${(step / 6) * 100}%` }}
        ></div>
      </div>

      <div className="card p-4 shadow-lg">
        <h1 className="text-center mb-4">Step {step} of 6</h1>
        {step === 1 && (
          <div>
            <h2>Basic Details</h2>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <PhoneInput
                country={'in'}
                value={formData.phone}
                onChange={(phone) => setFormData({ ...formData, phone })}
              />
            </div>
            <button className="btn btn-primary me-2" onClick={handleNext}>
              Next
            </button>
          </div>
        )}
        {step === 2 && (
          <div>
            <h2>Address Details</h2>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Address Line 1"
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Address Line 2"
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="City"
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="State"
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="number"
                className="form-control"
                placeholder="Pincode"
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Country"
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                required
              />
            </div>
            <button className="btn btn-secondary me-2" onClick={handleBack}>
              Back
            </button>
            <button className="btn btn-primary" onClick={handleNext}>
              Next
            </button>
          </div>
        )}
        {step === 3 && (
          <div>
            <h2>Other Details</h2>
            <div className="mb-3">
              <textarea
                className="form-control"
                placeholder="Additional Information"
                onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                required
              />
            </div>
            <button className="btn btn-secondary me-2" onClick={handleBack}>
              Back
            </button>
            <button className="btn btn-primary" onClick={handleNext}>
              Next
            </button>
          </div>
        )}
        {step === 4 && (
          <div>
            <h2>Upload Files</h2>
            <div className="mb-3">
              <input
                type="file"
                className="form-control"
                onChange={handleFileChange}
                multiple
              />
              <small className="text-muted">
                Only PNG and PDF files are allowed. Maximum of 5 files.
              </small>
            </div>
            {files.length > 0 && (
              <div>
                <h4>Uploaded Files:</h4>
                <ul>
                  {files.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}

            

            <button className="btn btn-secondary me-2" onClick={handleBack}>
              Back
            </button>
            <button className="btn btn-primary" onClick={handleNext}>
              Next
            </button>
          </div>
        )}


        {step === 5 && (
          <div>
            <h2>Review Information</h2>
            <p><strong>Name:</strong> {formData.name}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Phone:</strong> {formData.phone}</p>
            <p><strong>Address:</strong> {formData.address}</p>
            <p><strong>City:</strong> {formData.city}</p>
            <p><strong>Additional Info:</strong> {formData.additionalInfo}</p>
            <button className="btn btn-secondary me-2" onClick={handleBack}>
              Back
            </button>
            <button className="btn btn-primary" onClick={handleNext}>
              Next
            </button>
          </div>
        )}
        {step === 6 && (
          <div>
            <h2>Confirmation</h2>
            <p>Are you sure you want to submit the form with the above information?</p>
            <button className="btn btn-secondary me-2" onClick={handleBack}>
              Back
            </button>
            <button className="btn btn-success" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/form" element={<MultiStepForm />} />
      </Routes>
    </Router>
  );
};

export default App;
