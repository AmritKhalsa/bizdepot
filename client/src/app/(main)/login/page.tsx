
import pb from "../../../../connections/pocketbase";
import LoginForm from "./_components/LoginForm";

export default async function login(){
    const brokers = await pb.collection('Broker').getFullList();
    const BrokerNames = brokers.map(e=>e.Name)

    return(
        
        <LoginForm brokerNames={BrokerNames}/>
    )
}