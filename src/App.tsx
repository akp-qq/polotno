// import React from 'react';
// import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from 'polotno';
// import { Toolbar } from 'polotno/toolbar/toolbar';
// import { PagesTimeline } from 'polotno/pages-timeline';
// import { ZoomButtons } from 'polotno/toolbar/zoom-buttons';
// import { SidePanel } from 'polotno/side-panel';
// import { Workspace } from 'polotno/canvas/workspace';
// import '@blueprintjs/core/lib/css/blueprint.css';
// import { createStore } from 'polotno/model/store';

// import { setDefaultQuery } from 'polotno/side-panel/background-panel';

// // Set default background search query
// setDefaultQuery('city');

// // Create the Polotno store
// const store = createStore({
//   key: 'TBvfe1pYY36PJz4l5E2B',
//   showCredit: true,
// });

// // Add initial page
// store.addPage();

// const App: React.FC = () => {
//   return (
//     <PolotnoContainer style={{ width: '100vw', height: '100vh' }}>
//       <SidePanelWrap>
//         <SidePanel store={store} />
//       </SidePanelWrap>
//       <WorkspaceWrap>
//         <Toolbar store={store} downloadButtonEnabled />
//         <Workspace store={store} />
//         <ZoomButtons store={store} />
//         <PagesTimeline store={store} />
//       </WorkspaceWrap>
//     </PolotnoContainer>
//   );
// };

// export default App;

import React, { useState } from "react";
import Editor from "./Editor"

const App = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [designJson, setDesignJson] = useState(null);

  const handleGenerateDesign = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://imakp.app.n8n.cloud/webhook/41f2c62b-59d2-4ea8-8805-361449de5289",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: prompt.trim() }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      setDesignJson(json);
      setShowEditor(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to generate design: ${errorMessage}`);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !loading) {
      handleGenerateDesign();
    }
  };

  if (showEditor) {
    return (
      <Editor
        designJson={designJson}
        onBack={() => {
          setShowEditor(false);
          setPrompt("");
          setDesignJson(null);
        }}
      />
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "50px 40px",
          maxWidth: "600px",
          width: "100%",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1
            style={{
              margin: "0 0 10px 0",
              fontSize: "32px",
              fontWeight: "700",
              color: "#1a202c",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            AI Design Generator
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "16px",
              color: "#718096",
            }}
          >
            Describe your design and let AI create it for you
          </p>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "10px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#2d3748",
            }}
          >
            Your Design Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              setError("");
            }}
            onKeyPress={handleKeyPress}
            placeholder="E.g., Create a modern social media post for a coffee shop with warm colors..."
            disabled={loading}
            style={{
              width: "100%",
              minHeight: "120px",
              padding: "15px",
              fontSize: "15px",
              border: "2px solid #e2e8f0",
              borderRadius: "12px",
              resize: "vertical",
              fontFamily: "inherit",
              transition: "all 0.2s",
              outline: "none",
              boxSizing: "border-box",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#667eea";
              e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e2e8f0";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        {error && (
          <div
            style={{
              padding: "12px 16px",
              marginBottom: "20px",
              background: "#fed7d7",
              color: "#c53030",
              borderRadius: "8px",
              fontSize: "14px",
              border: "1px solid #fc8181",
            }}
          >
            {error}
          </div>
        )}

        <button
          onClick={handleGenerateDesign}
          disabled={loading || !prompt.trim()}
          style={{
            width: "100%",
            padding: "16px",
            fontSize: "16px",
            fontWeight: "600",
            color: "white",
            background:
              loading || !prompt.trim()
                ? "#cbd5e0"
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            borderRadius: "12px",
            cursor: loading || !prompt.trim() ? "not-allowed" : "pointer",
            transition: "all 0.3s",
            boxShadow:
              loading || !prompt.trim()
                ? "none"
                : "0 4px 15px rgba(102, 126, 234, 0.4)",
            transform: "translateY(0)",
          }}
          onMouseEnter={(e) => {
            if (!loading && prompt.trim()) {
              const target = e.target as HTMLButtonElement;
              target.style.transform = "translateY(-2px)";
              target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.5)";
            }
          }}
          onMouseLeave={(e) => {
            if (!loading && prompt.trim()) {
              const target = e.target as HTMLButtonElement;
              target.style.transform = "translateY(0)";
              target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
            }
          }}
        >
          {loading ? (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <span
                style={{
                  width: "20px",
                  height: "20px",
                  border: "3px solid rgba(255, 255, 255, 0.3)",
                  borderTop: "3px solid white",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
              Generating Design...
            </span>
          ) : (
            "Generate Design"
          )}
        </button>

        <p
          style={{
            marginTop: "20px",
            fontSize: "13px",
            color: "#a0aec0",
            textAlign: "center",
          }}
        >
          Powered by Polotno Editor
        </p>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default App;
