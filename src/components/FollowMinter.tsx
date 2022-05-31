import { useState } from "react";
import "../style/follow.css";
import ConnectButton from "./ConnectButton";
import {
  FollowButton,
  Env,
  Blockchain
} from "@cyberconnect/react-follow-button";

export default function FollowMinter() {
  const [account, setAccount] = useState<string>("");

  return (
    <div className="container">
      <h1>Follow the DeCo's minter</h1>
      <ConnectButton setAccount={setAccount}></ConnectButton>
      {account && (
        <FollowButton
          provider={window.ethereum}
          namespace="CyberConnect"
          toAddr="0xe6aab1f16ff560d309ed7ce8e08d290306a0906c"
          env={Env.PRODUCTION}
          chain={Blockchain.ETH}
          onSuccess={(e) => {
            console.log(e);
          }}
          onFailure={(e) => {
            console.log(e);
          }}
        />
      )}
    </div>
  );
}
