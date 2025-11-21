import { useState, useEffect } from 'react';
import "../components/List.css"
import { db, auth } from "../../../FirebaseConfig"
import { 
    collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot,
    getDoc,
} from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { useAuthState } from "react-firebase-hooks/auth";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CoinIcon from "../images/coin.png";
import CheckIcon from "../images/checkmark.png";
import QuestionIcon from "../images/question-mark.png";
import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TreatShop from "../images/treat-shop-logo.png"
import Sweets from "../images/sweets.png"
import Wallet from "../images/wallet.png"
import buyText from "../images/buy.png"
import confetti from "canvas-confetti";



export default function List() {

    const [rewards, setRewards] = useState([]);
    const [newReward, setNewReward] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingValue, setEditingValue] = useState("");

    const [editCostIndex, setEditCostIndex] = useState(null);
    const [editCostValue, setEditCostValue] = useState("");

    const [enterAmountVisible, setEnterAmountVisible] = useState(true);
    const [totalCoins, setTotalCoins] = useState(0);
    const [isFading, setIsFading] = useState(false);

    const [user] = useAuthState(auth);
    const navigate = useNavigate();


    const [boughtReward, setBoughtReward] = useState(false);

    // -------------------------
    // Load rewards in real time
    // -------------------------
    useEffect(() => {
        if (!user) return;

        const rewardsRef = collection(db, "users", user.uid, "rewards");

        const unsubscribe = onSnapshot(rewardsRef, snapshot => {
            const loaded = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setRewards(loaded);
        });

        return unsubscribe;
    }, [user]);

    const handleConfetti = async()=>{
        var count = 200;
        var defaults = {
          origin: { y: 0.7 }
        };
        
        function fire(particleRatio, opts) {
          confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio)
          });
        }
        
        fire(0.25, {
          spread: 26,
          startVelocity: 55,
        });
        fire(0.2, {
          spread: 60,
        });
        fire(0.35, {
          spread: 100,
          decay: 0.91,
          scalar: 0.8
        });
        fire(0.1, {
          spread: 120,
          startVelocity: 25,
          decay: 0.92,
          scalar: 1.2
        });
        fire(0.1, {
          spread: 120,
          startVelocity: 45,
        });
    }

     
    // -------------------------
    // Add reward
    // -------------------------
    async function addReward() {
        if (!user) return;
        
        if (newReward.trim() === "") return;

        const rewardsRef = collection(db, "users", user.uid, "rewards");

        await addDoc(rewardsRef, {
            description: newReward,
            achieved: false,
            coinValue: 0,
        });

        setNewReward("");
    }

    // -------------------------
    // Delete reward
    // -------------------------
    async function deleteReward(id) {

       


        await deleteDoc(doc(db, "users", user.uid, "rewards", id));
         setEditingIndex(null);
          setEditingValue("");
    }

    // -------------------------
    // Save edited reward description
    // -------------------------
    async function saveReward(reward) {
        const ref = doc(db, "users", user.uid, "rewards", reward.id);
        await updateDoc(ref, { description: editingValue });
        setEditingIndex(null);
        setEditingValue("");
    }

    // -------------------------
    // Save edited coin value
    // -------------------------
    async function saveCost(reward) {

        const ref = doc(db, "users", user.uid, "rewards", reward.id);

        await updateDoc(ref, {
            coinValue: Number(editCostValue)
        });
        setEditCostIndex(null);
        setEditCostValue("");
                setEnterAmountVisible(false)

    }

    function startEditing(index) {
        setEditingIndex(index);
        setEditingValue(rewards[index].description);
    }

    function startEditingCost(index) {
        setEnterAmountVisible(true);
        setEditCostIndex(index);
        setEditCostValue(rewards[index].coinValue);
    }

    function handleBackButton() {
        navigate("/");
    }

     function getTotalCoins(){
        if (user){
            const userRef = doc(db, "users", user.uid);

            return onSnapshot(userRef, (doc)=>{
                if (doc.exists()){
                    const coins = doc.data();
                    setTotalCoins(coins.totalCoins || 0)
                }
            })
        }

    }


    

    console.log("total coins" , totalCoins);

    useEffect(() => {
        if (!user) {
            return
        }

        const unsubscribe = getTotalCoins();
        return () => unsubscribe && unsubscribe();

    },[user])

    async function buyReward(rewardVal, reward,totalCoins){
            //totalCoins given by totalCoins
            // reward id given
            // if totalCoins - reward.coinValue >= 0 then
                // update totalCoins
                // delete reward doc
                // show congrats component
                // rewawrd STAYS until user clicks x, then deleted from doc -< diff function


                const userRef = doc(db,"users", user.uid);
                const ref = doc(db, "users", user.uid, "rewards", reward.id);

                if ((totalCoins - rewardVal) >= 0) {
                    
                   const totalDeducted = totalCoins - rewardVal;
                    try {
                        await updateDoc(userRef, {
                            totalCoins:totalDeducted,
                        })
                        setTotalCoins(totalDeducted);
                        
        const rewardDesc = reward.description;

        
                       await handleConfetti();
                         await new Promise(resolve => setTimeout(resolve, 1000)); // 1.5 second delay

                        alert("Good job, you've achieved a treat! By all means, " + reward.description + "! ^_^");
                       await deleteReward(reward.id);
                       setBoughtReward(true);
                         setShowPopup(true);

                          
                        console.log("totalcoins after bought", totalCoins);
                    }catch(err){
                        console.log("cant update totalCoins after buyReward")
                    }

                    
                } else {
                    alert("You don't have enough coins! Come back another day!");
                }


            //return updated coinValue for the reawrd
    }



    return (
        <div className='list-content'>
        <div className="treat-list-page">
            <div className="treat-list">
             <button className="back-button" onClick={handleBackButton}><ArrowBackIcon/></button>
               

               <div className='user-wallet'>
               <img
                          src={Wallet}
                          className="wallet"
                          
                        />
                <p style={{fontWeight:"bold",color:"maroon",marginRight:"20px"}}>{totalCoins}</p>

                <img
                        src={CoinIcon}
                        className="wallet-coins"
                />

                </div>
                
                
             <div className="list-container"> <div className="title"> <img
                          src={TreatShop}
                          className="treat-yourself"
                          
                        /></div>
                
                 <img
                          src={Sweets}
                          className="sweets"
                          
                        />
                
                <div>
                    <input 
                        type="text"
                        placeholder="Enter a treat..."
                        value={newReward}
                        onChange={(e) => setNewReward(e.target.value)}
                         onKeyDown={(e) => {
                               if (e.key === "Enter") addReward();
                                 }}
                                
                        
                    />
                    <button className="add-button" onClick={addReward}>ADD</button>
                </div>

                <ol className='container'>
                    {rewards.map((reward, index) => (
                        <li key={reward.id}>
                            {editingIndex === index ? (
                                <>
                                    <input 
                                        type="text"
                                        value={editingValue}
                                        onChange={(e) => setEditingValue(e.target.value)}
                                        className='desc'
                                    />

                                    <button 
                                        className="save-button"
                                        onClick={() => saveReward(reward)}
                                    >
                                        Save
                                    </button>
                                    <button 
                                        className="cancel-button"
                                        onClick={() => {
                                            setEditingIndex(null);
                                            setEditingValue("");
                                        }}
                                    >
                                        Cancel
                                    </button>
                                     <button 
                                        className="delete-button"
                                        onClick={() => deleteReward(reward.id)
                                        }
                                    >
                                        <DeleteIcon fontSize="small"/>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span className="text">{reward.description}</span>


                                    <img className="coin-icon" src={CoinIcon} />

                                    {/* COIN COST INPUT */}
                                    
                                    <div className="coin-enter-container">
                                    <input 
                                        type="number"
                                        value={
                                            editCostIndex === index
                                                ? editCostValue
                                                : reward.coinValue ?? 0
                                        }
                                        onChange={(e) => setEditCostValue(e.target.value)}
                                        onFocus={() => startEditingCost(index)}
                                        className="coin-text"
                                    />
                                    {enterAmountVisible && editCostIndex === index && (<p className="enter-value" style={{fontSize:"0.8rem", marginRight:"10px",marginLeft:"10px"}} > Enter value</p>)}

</div>
                                   <div className='icon-container'>
                                        
                                        {/* Save cost button 
                                            If we're on the correct cost index and the cost value is being edited 
                                            or is not empty then show the checkmark icon. clicking it -> saving cost
                                        */}
                                        
                                         {editCostIndex === index && editCostValue !== "" && 
                                        String(editCostValue) !== String(reward.coinValue ?? 0) && (
                                        <img 
                                            className="check-icon" 
                                            src={CheckIcon} 
                                            onClick={() => saveCost(reward)}
                                            style={{ cursor: 'pointer' }}
                                            alt="Save"
                                        />
                                        )}

                                    </div>
                                                
                                   

                                    <button 
                                        className="edit-button"
                                        onClick={() => startEditing(index)}
                                    >
                                        <EditIcon fontSize='small'/>
                                    </button>

                                </>
                                
                            )}
                            <img src={buyText} onClick={()=>buyReward(reward.coinValue, reward, totalCoins)} className='buy-btn'/>
                            
                        </li>
                    ))}

                </ol>
            </div>
            </div>  
        </div>
        </div>
    );
}
