import * as database from '../libs/database';
import * as utils from '../libs/utils';
function BrushButton(props) {
    const handleOnClick = async (event) => {
        const bookinfo = utils.getBookInfo();
        // console.log(chapter);
        database.save({
            title: bookinfo.title,
            user: utils.getUser(),
            chapter: props.chapter,
            number: props.textIndex,
            content: props.selectedParagraph,
            text: props.txt,
            errType: "1",
        });
    };
    return <button className="brushButton" onClick={handleOnClick}>
        Mint Selected
    </button>
}
export default BrushButton;