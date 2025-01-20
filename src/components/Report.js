import React, { useRef } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const Report = ({ data }) => {
    const {
        scores = {}, // { functionName: points }
        max_scores = {}, // { functionName: maxScore }
        total_score = 0,
        grade = "N/A",
        ranks = {}, // { functionName: rank }
    } = data;

    const reportRef = useRef(); // Ref for the white box

    // Prepare data for the table
    const tableData = Object.entries(scores).map(([functionName, points]) => {
        const maxScore = max_scores[functionName] || 1; // Default to 1 to avoid division by zero
        const percentage = Math.round((points / maxScore) * 100) || 0; // Calculate percentage (rounded)
        const rank = ranks[functionName] || "N/A"; // Get rank from backend

        return {
            element: functionName.replace(/_/g, " ").toUpperCase(), // Replace underscores and capitalize
            points: `${points} / ${maxScore}`,
            percentage,
            rank,
        };
    });

    // Prepare data for the horizontal bar chart
    const chartData = {
        labels: tableData.map((row) => row.element),
        datasets: [
            {
                label: "% of Available",
                data: tableData.map((row) => row.percentage),
                backgroundColor: "#003b73",
                hoverBackgroundColor: "#0056b3",
            },
        ],
    };

    const chartOptions = {
        indexAxis: "y", // Horizontal bars
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false, // Hide the legend
            },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.raw}%`, // Show percentage on hover
                },
            },
            datalabels: {
                anchor: "end",
                align: "end",
                color: "#003b73",
                font: {
                    weight: "bold",
                    size: 12,
                },
                formatter: (value) => `${value}%`, // Show percentage at the end of the bar
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                max: 100, // Set max to 100% for percentage visualization
                ticks: {
                    callback: (value) => `${value}%`, // Show percentage on x-axis
                },
            },
            y: {
                ticks: {
                    font: {
                        size: 12,
                        weight: "bold", // Bold labels for function names
                    },
                },
            },
        },
    };

    // Get current date in DD/MM/YYYY format
    const getCurrentDate = () => {
        const today = new Date();
        return today.toLocaleDateString("en-GB"); // Format: DD/MM/YYYY
    };

    // Download report as PDF
    const downloadPDF = async () => {
        const input = reportRef.current;

        // Temporarily hide the button during PDF generation
        const buttonDiv = document.querySelector(".no-print");
        if (buttonDiv) buttonDiv.style.visibility = "hidden"; // Use visibility: hidden instead of display: none

        const canvas = await html2canvas(input, { scale: 2, useCORS: true });

        const pdf = new jsPDF("p", "mm", "a4");
        const padding = 10;

        // Add logos
        const heraLogo = new Image();
        heraLogo.src = "hera.png"; // Path for the HERA logo

        const bathLogo = new Image();
        bathLogo.src = "/uob.png"; // Path for the Bath logo

        const logoWidth = 23;
        const logoHeight = 10;

        // Add logos at the top
        pdf.addImage(heraLogo, "PNG", padding, 10, logoWidth, logoHeight); // HERA logo
        pdf.addImage(bathLogo, "WEBP", pdf.internal.pageSize.getWidth() - logoWidth - padding, 10, logoWidth, logoHeight); // Bath logo

        // Add "Role Summary" header
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(16);
        pdf.setTextColor("#003b73"); // Blue color for the header text
        pdf.text("ROLE SUMMARY", pdf.internal.pageSize.getWidth() / 2, 30, {
            align: "center",
        });

        // Prepare content from canvas
        const imgData = canvas.toDataURL("image/png");
        const pageWidth = pdf.internal.pageSize.getWidth() - 2 * padding;
        const pageHeight = pdf.internal.pageSize.getHeight() - 50; // Leave space for header and logos

        let yPosition = 32; // Start content below the header

        const canvasHeight = (canvas.height * pageWidth) / canvas.width;

        if (canvasHeight <= pageHeight) {
            // If the content fits on one page
            pdf.addImage(imgData, "PNG", padding, yPosition, pageWidth, canvasHeight);
        } else {
            // If the content exceeds one page
            let remainingHeight = canvasHeight;
            let currentPosition = yPosition;

            while (remainingHeight > 0) {
                pdf.addImage(imgData, "PNG", padding, currentPosition, pageWidth, pageHeight);
                remainingHeight -= pageHeight;
                currentPosition -= pageHeight;

                if (remainingHeight > 0) {
                    pdf.addPage(); // Add a new page
                    currentPosition = 10; // Reset position for new page
                }
            }
        }

        // Add footer box with date and University of Bath
        const footerHeight = 6; // Footer box height
        const footerMargin = 15; // Horizontal margin for the box
        pdf.setFillColor(128, 0, 128); // Purple background
        pdf.rect(
            footerMargin, // Start x position with margin
            pdf.internal.pageSize.getHeight() - footerHeight, // Align the box at the very bottom of the page
            pdf.internal.pageSize.getWidth() - 2 * footerMargin, // Width reduced with margins
            footerHeight, // Height of the box
            "F"
        );

        // Add text inside the footer box
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8); // Smaller font size
        pdf.setTextColor("white");
        pdf.text(
            `${getCurrentDate()} - University of Bath`,
            pdf.internal.pageSize.getWidth() / 2, // Center horizontally
            pdf.internal.pageSize.getHeight() - footerHeight / 2 + 2, // Adjust Y-position to be vertically centered in the box
            {
                align: "center",
            }
        );



        pdf.save("evaluation_report.pdf");

        // Restore button visibility
        if (buttonDiv) buttonDiv.style.visibility = "visible"; // Restore visibility
    };

    return (
        <div
            style={{
                width: "97%",
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                overflowY: "auto",
                maxHeight: "90vh",
                padding: "2rem",
            }}
        >
            <div ref={reportRef}>
                {/* Header Section */}
                <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h2 style={{ color: "#003b73", margin: 0 }}>ROLE SUMMARY</h2>
                    <div style={{ marginBottom: "1rem" }}>
                        <button
                            onClick={downloadPDF}
                            style={{
                                padding: "0.75rem 1.5rem",
                                backgroundColor: "#003b73",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontSize: "1rem",
                                fontWeight: "bold",
                            }}
                        >
                            Download as PDF
                        </button>
                    </div>
                </div>

                {/* Role Summary */}
                <div
                    style={{
                        padding: "1.5rem",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        marginBottom: "2rem",
                        backgroundColor: "#f8f8f8",
                    }}
                >
                    <p style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
                        <strong>Grade:</strong> {grade}
                    </p>
                    <p style={{ fontSize: "1.2rem" }}>
                        <strong>Total Score:</strong> {total_score}
                    </p>
                </div>

                {/* Scores Breakdown */}
                <div style={{ marginTop: "2rem" }}>
                    <h3>Scores Breakdown</h3>
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            marginBottom: "2rem",
                            fontSize: "1rem",
                            border: "1px solid #ddd",
                        }}
                    >
                        <thead>
                            <tr style={{ backgroundColor: "#003b73", color: "white" }}>
                                <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #ddd" }}>
                                    Element
                                </th>
                                <th style={{ padding: "0.75rem", textAlign: "center", border: "1px solid #ddd" }}>
                                    Points
                                </th>
                                <th style={{ padding: "0.75rem", textAlign: "center", border: "1px solid #ddd" }}>
                                    % of Available
                                </th>
                                <th style={{ padding: "0.75rem", textAlign: "center", border: "1px solid #ddd" }}>
                                    Rank
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row, index) => (
                                <tr
                                    key={index}
                                    style={{
                                        backgroundColor: index % 2 === 0 ? "#f6f6f6" : "white",
                                    }}
                                >
                                    <td style={{ padding: "0.75rem", textAlign: "left", fontWeight: "bold", border: "1px solid #ddd" }}>
                                        {row.element}
                                    </td>
                                    <td style={{ padding: "0.75rem", textAlign: "center", border: "1px solid #ddd" }}>
                                        {row.points}
                                    </td>
                                    <td style={{ padding: "0.75rem", textAlign: "center", border: "1px solid #ddd" }}>
                                        {row.percentage}%
                                    </td>
                                    <td style={{ padding: "0.75rem", textAlign: "center", border: "1px solid #ddd" }}>
                                        {row.rank}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Graphical Representation */}
                <div style={{ marginTop: "2rem", height: "35rem", width: "100%" }}>
                    <h3>Graphical Representation</h3>
                    <Bar data={chartData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

export default Report;
