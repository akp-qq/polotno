import React, { useEffect } from 'react';
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from 'polotno';
import { Toolbar } from 'polotno/toolbar/toolbar';
import { PagesTimeline } from 'polotno/pages-timeline';
import { ZoomButtons } from 'polotno/toolbar/zoom-buttons';
import { SidePanel } from 'polotno/side-panel';
import { Workspace } from 'polotno/canvas/workspace';
import '@blueprintjs/core/lib/css/blueprint.css';
import { createStore } from 'polotno/model/store';
import { setDefaultQuery } from 'polotno/side-panel/background-panel';

// Set default background search query
setDefaultQuery('city');

// Create the Polotno store
const store = createStore({
  key: 'TBvfe1pYY36PJz4l5E2B',
  showCredit: true,
});

// Add initial page
store.addPage();

interface EditorProps {
  designJson?: any;
  onBack: () => void;
}

const Editor: React.FC<EditorProps> = ({ designJson, onBack }) => {
  useEffect(() => {
    // Load the design JSON when component mounts
    if (designJson) {
      try {
        store.loadJSON(designJson);
      } catch (err) {
        console.error('Error loading design:', err);
      }
    }

    // Try to load saved design from localStorage if no designJson provided
    if (!designJson) {
      try {
        const saved = localStorage.getItem('design');
        if (saved) {
          const savedJson = JSON.parse(saved);
          store.loadJSON(savedJson);
        }
      } catch (err) {
        console.error('Error loading saved design:', err);
      }
    }
  }, [designJson]);

  const handleSaveDesign = () => {
    try {
      const json = store.toJSON();
      localStorage.setItem('design', JSON.stringify(json));
      alert('Design saved successfully!');
      console.log('Saved design:', json);
    } catch (err) {
      console.error('Error saving design:', err);
      alert('Failed to save design');
    }
  };

  const handleLoadDesign = () => {
    try {
      const saved = localStorage.getItem('design');
      if (saved) {
        const savedJson = JSON.parse(saved);
        store.loadJSON(savedJson);
        alert('Design loaded successfully!');
      } else {
        alert('No saved design found');
      }
    } catch (err) {
      console.error('Error loading design:', err);
      alert('Failed to load design');
    }
  };

  return (
    <PolotnoContainer style={{ width: '100vw', height: '100vh' }}>
    <SidePanelWrap>
        <SidePanel store={store} />
    </SidePanelWrap>
    <WorkspaceWrap>
        <Toolbar store={store} downloadButtonEnabled />
        <Workspace store={store} />
        <ZoomButtons store={store} />
        <PagesTimeline store={store} />
    </WorkspaceWrap>
    </PolotnoContainer>
  );
};

export default Editor;