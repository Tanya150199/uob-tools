import React from "react";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { Viewer } from "@react-pdf-viewer/core";

const RulesAndGuidelines = () => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <h1 style={{ textAlign: "center", color: "#003b73", marginBottom: "1rem" }}>
                Rules and Guidelines
            </h1>
            {/* Scrollable content */}
            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    marginBottom: "1rem",
                }}
            >
                <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                    <Viewer
                        fileUrl="/data/Questionnaire Guidance.pdf"
                        plugins={[defaultLayoutPluginInstance]}
                    />
                </Worker>
            </div>
            {/* Footer */}
            <footer
                style={{
                    backgroundColor: "#ffffff",
                    color: "#003b73",
                    textAlign: "center",
                    padding: "0.5rem",
                    borderTop: "1px solid #ccc",
                }}
            >
                © {new Date().getFullYear()} University of Bath. All rights reserved.
            </footer>
        </div>
    );
};

export default RulesAndGuidelines;
