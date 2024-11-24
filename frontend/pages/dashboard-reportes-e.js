import React, { useState, useEffect } from "react";
import axios from "axios";
import Papa from "papaparse";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import RunCircleIcon from "@mui/icons-material/RunCircle";
import RefreshIcon from "@mui/icons-material/Refresh";
import Sidebar from "../public/src/components/Sidebar";
import MapComponent from "../public/src/components/MapComponent";
import styles from "../public/src/components/Dashboard.module.css";

const Input = styled("input")({
  display: "none",
});

const DashboardReportesE = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [scriptOutput, setScriptOutput] = useState("");
  const [runId, setRunId] = useState("");
  const [filePath, setFilePath] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [csvData, setCsvData] = useState([]);
  const [error, setError] = useState("");

  const steps = ["Upload Files", "Run Python Script", "Refresh Map"];

  const handleFileSelect = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    const filteredFiles = selectedFiles.filter(
      (newFile) => !files.some((file) => file.name === newFile.name)
    );
    setFiles((prevFiles) => [...prevFiles, ...filteredFiles]);

    for (let file of filteredFiles) {
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log("File uploaded successfully:", response.data.filePath);
        setFilePath(response.data.filePath); // Guarda el path del archivo
      } catch (error) {
        console.error("Error uploading file:", error);
        setError("Error uploading file: " + error.message);
      }
    }

    setActiveStep(1);
};


  const handleDelete = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const runPythonScript = async () => {
    setIsLoading(true);
    setError("");
    setScriptOutput("");
    setRunId("");
    setFilePath("");

    try {
      const response = await fetch("http://127.0.0.1:5000/run-script", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        setError(`Server Error: ${data.error}`);
      } else {
        setScriptOutput(data.result);
        setRunId(data.runId);
        setFilePath(data.filePath);
        setActiveStep(2);
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/results/results_log.csv", {
        responseType: "text",
      })
      .then((response) => {
        Papa.parse(response.data, {
          header: true,
          complete: (results) => {
            setCsvData(results.data);
            setIsLoading(false);
          },
          error: (error) => {
            console.error("Error parsing CSV:", error);
            setIsLoading(false);
          },
        });
      })
      .catch((error) => {
        console.error("Error fetching CSV:", error);
        setIsLoading(false);
      });
  }, []); // Dependencia vacía para que se ejecute solo al montar el componente

  const refreshMap = () => {
    // Reiniciar la lógica del mapa si es necesario
    console.log("Refreshing map...");
    setActiveStep(0); // Reiniciar al primer paso después de completar el proceso
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <Box className={styles.mainContent} p={3}>
          {/* Header and search bar code remains the same */}

          <Typography variant="h4" gutterBottom>
            Resources
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ mb: 2 }}>
            <label htmlFor="file-upload">
              <Input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileSelect}
              />
              <Button
                variant="contained"
                color="primary"
                component="span"
                startIcon={<FolderIcon />}
                disabled={activeStep !== 0}
              >
                Upload Files
              </Button>
            </label>

            <Button
              variant="contained"
              color="secondary"
              sx={{ ml: 2, background: "#FB8C00" }}
              onClick={runPythonScript}
              startIcon={
                isLoading ? <CircularProgress size={24} /> : <RunCircleIcon />
              }
              disabled={activeStep !== 1 || isLoading}
            >
              {isLoading ? "Running..." : "Run"}
            </Button>

            <Button
              variant="contained"
              color="primary"
              sx={{ ml: 2 }}
              onClick={refreshMap}
              startIcon={<RefreshIcon />}
              disabled={activeStep !== 2}
            >
              Refresh Map
            </Button>
          </Box>

          {error && (
            <Paper sx={{ mt: 2, p: 2, bgcolor: "#ffebee" }}>
              <Typography color="error">{error}</Typography>
            </Paper>
          )}

          {scriptOutput && (
            <Paper sx={{ mt: 2, p: 2, maxHeight: 200, overflowY: "auto" }}>
              <Typography variant="h6">Script Output:</Typography>
              <pre>{scriptOutput}</pre>
              {runId && (
                <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
                  Run ID: {runId}
                </Typography>
              )}
              {filePath && (
                <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
                  Created File: {filePath}
                </Typography>
              )}
            </Paper>
          )}

          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>File Name</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {files.map((file, index) => (
                  <TableRow key={index}>
                    <TableCell>{file.name}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDelete(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h6" gutterBottom mt={4}>
            CSV Data
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {csvData[0] &&
                    Object.keys(csvData[0]).map((key) => (
                      <TableCell key={key}>{key}</TableCell>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {csvData.map((row, index) => (
                  <TableRow key={index}>
                    {Object.values(row).map((value, idx) => (
                      <TableCell key={idx}>{value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <MapComponent />
        </Box>
      </div>
    </div>
  );
};

export default DashboardReportesE;
