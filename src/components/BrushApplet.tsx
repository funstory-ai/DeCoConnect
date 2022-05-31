import FollowButton from "./FollowMinter";
import BrushButton from "./BrushButton";
import { useState } from 'react';

function BrushApplet({selectedParagraph, txt, textIndex, chapter, pos}) {
  const [showResults, setShowResults] = useState(true);
  // setShowResults(true);
  const handleClick = async (e) => {
    setShowResults(false);
    document.addEventListener(
      "mouseup",
      () => {
        setShowResults(true);
      },
      { once: true }
    );
  }
  return (
    <div style = {pos} className  = "optionBoxDiv" onClick={handleClick}>
      {showResults ? <BrushButton selectedParagraph={selectedParagraph} txt={txt} textIndex={textIndex} chapter={chapter}/> : null}
      {/* <FollowButton /> */}
    </div>
  );
}

export default BrushApplet;
