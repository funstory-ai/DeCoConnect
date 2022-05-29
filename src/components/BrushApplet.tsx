import FollowButton from "./FollowMinter";
import BrushButton from "./BrushButton";
import { useState } from 'react';

function BrushApplet(selectedParagraph, txt, textIndex, chapter, pos) {
  const [showResults, setShowResults] = useState(false)
  const handleClick = async (e) => {
    setShowResults(true)
  }
  return (
    <div style = {pos} className  = "optionBoxDiv" onClick={handleClick}>
      showResults ? <BrushButton selectedParagraph={selectedParagraph} txt={txt} textIndex={textIndex} chapter={chapter}/> : null
      <FollowButton />
    </div>
  );
}

export default BrushApplet;
