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
        try {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts"
            });

            // Update the state for account
            // setAccount(accounts[0]);
            alert(`Connected with: ${accounts[0]}`);
        } catch (error) {
            console.error(error.message);
        }
    };
    return <button className="brushButton" onClick={handleOnClick}>
        Mint Selected
    </button>
}
export default BrushButton;