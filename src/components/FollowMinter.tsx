import CyberConnect, { Env, Blockchain } from "@cyberlab/cyberconnect";
declare var window: any;
const cyberConnect = new CyberConnect({
  namespace: "CyberConnect",
  env: Env.PRODUCTION,
  chain: Blockchain.ETH,
  provider: window.ethereum
});

function FollowButton() {
  const handleOnClick = async () => {
    // Prompt to enter the address
    const address = prompt("Enter the ens/address to follow:");

    try {
      await cyberConnect.connect(address);
      alert(`Success: you're following ${address}!`);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <button className="followButton" onClick={handleOnClick}>
      Follow The Minter
    </button>
  );
}

export default FollowButton;
