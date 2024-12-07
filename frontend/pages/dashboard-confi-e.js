import React, { useState } from "react";
import { Box, Typography, Tabs, Tab, Card, CardMedia, CardContent, Avatar, Grid, Paper } from "@mui/material";
import Sidebar from "../public/src/components/Sidebar";
import styles from "../public/src/components/Dashboard.module.css";

const DashboardIConfiguracionE = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const teamMembers = [
    {
      name: "Azul Kuri",
      university: "Polytechnic University of Pachuca​",
      role: "Software Developer Engineer",
      experience:
        "Software Engineer specializing in mobile development and AI solutions. Certified as a Meta iOS and Android Developer, I’ve contributed to innovative projects like the KeepNAI wildfire detection system and have experience with Kotlin, Swift, and React Native.​",
      photo: "/images/azul.png",
    },
    {
      name: "Hector Valdes",
      university: "Autonomous University of State of Mexico",
      role: "Software Developer Engineer",
      experience:
        "5 years of experience as a Software Development Engineer in the aerospace and automotive industries, embedded data processing, and analytics. Led international projects focused on solving environmental hazards using AI tools, embedded systems, and (GIS)",
      photo: "/images/hector.png",
    },
    {
      name: "Diego Cerda",
      university: "University of Sheffield​",
      role: "Project Manager / Software Engineer​",
      experience:
        "Senior Data Science Specialist with extensive expertise in machine learning, data analysis, and software development.​",
      photo: "/images/diego.png",
    },
    {
      name: "Baldwin Cortes",
      university: "Michoacan University of San Nicolas de Hidalgo",
      role: "PhD Electrical Eng. | Associate Energy Insights​",
      experience: "5 year as Research Scientist in energy industry​",
      photo: "/images/baldwin.png",
    },
  ];

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <Box className={styles.mainContent}>
          <Typography variant="h4" gutterBottom>
            About Us
          </Typography>

          {/* Tabs Section */}
          <Tabs value={selectedTab} onChange={handleTabChange} centered>
            <Tab label="Our Company" />
            <Tab label="Our Team" />
          </Tabs>

          {/* Content Section */}
          {selectedTab === 0 && (
            <Box sx={{ padding: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
                Welcome to EcoVentus
              </Typography>
              <Typography variant="body1" paragraph>
                Welcome to EcoVentus, where innovation meets sustainability. We specialize in
                cutting-edge technology to address critical environmental and industrial challenges. Our
                mission is to create efficient, scalable solutions that bridge the gap between renewable
                energy and sustainable agriculture.
              </Typography>
              <Typography variant="body1" paragraph>
                At the heart of our work is the integration of Artificial Intelligence (AI), Geographical
                Information Systems (GIS), and advanced drone and satellite technologies. By leveraging
                these tools, we deliver real-time insights for managing photovoltaic and agro-photovoltaic
                systems, optimizing clean energy production, and improving agricultural yields.
              </Typography>
              <Typography variant="body1" paragraph>
                EcoVentus is more than a technology provider; we are committed to a sustainable future.
                Our work contributes to carbon emission reduction, food security, and a resilient green
                economy. Together, we aim to shape a world where technology and sustainability go hand
                in hand.
              </Typography>
              <Box sx={{ textAlign: "center", marginTop: 3 }}>
                <img src="/images/eco.png" alt="EcoVentus" style={{ maxWidth: "100%", borderRadius: "10px" }} />
              </Box>
            </Box>
          )}

          {selectedTab === 1 && (
            <Box
              sx={{
                padding: 3,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 3,
              }}
            >
              {teamMembers.map((member, index) => (
                <Card key={index} sx={{ textAlign: "center", borderRadius: "15px", boxShadow: "none",  border: "none", backgroundColor: "transparent",}}>
                  <CardMedia
                    component="img"
                    image={member.photo}
                    alt={member.name}
                    sx={{ height: 200, objectFit: "contain", backgroundColor: "transparent",boxShadow: "none", border: "none", borderRadius: "15px 15px 0 0" }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {member.name}
                    </Typography>
                    <Typography color="textSecondary" variant="subtitle1">
                      {member.university}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontStyle: "italic", color: "primary.main" }}>
                      {member.role}
                    </Typography>
                    <Typography variant="body2" sx={{ marginTop: 1 }}>
                      {member.experience}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      </div>
    </div>
  );
};

export default DashboardIConfiguracionE;
