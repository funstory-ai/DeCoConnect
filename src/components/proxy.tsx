import BrushApplet from "./BrushApplet";
import CommentApplet from "./CommentApplet";
import FollowMinter from "./FollowMinter";

export function ProxyBrushApplet(props: any) {
    return <BrushApplet {...props} />
}
export function ProxyCommentApplet(pos) {
    return (
        <div style={pos} className  = "optionBoxDiv">
            <FollowMinter />
            <CommentApplet />
        </div>
    )
}