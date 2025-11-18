import { useState, useEffect } from 'react';
import "../components/List.css"
import { db, auth } from "../../../FirebaseConfig"
import { 
    collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot
} from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { useAuthState } from "react-firebase-hooks/auth";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CoinIcon from "../images/coin.png";
import CheckIcon from "../images/checkmark.png";
import QuestionIcon from "../images/question-mark.png";

export default function List() {

    const [rewards, setRewards] = useState([]);
    const [newReward, setNewReward] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingValue, setEditingValue] = useState("");

    const [editCostIndex, setEditCostIndex] = useState(null);
    const [editCostValue, setEditCostValue] = useState("");

    const [enterAmountVisible, setEnterAmountVisible] = useState(true);

    const [user] = useAuthState(auth);
    const navigate = useNavigate();

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

    }

    function startEditing(index) {
        setEditingIndex(index);
        setEditingValue(rewards[index].description);
    }

    function startEditingCost(index) {
        setEditCostIndex(index);
        setEditCostValue(rewards[index].coinValue);
    }

    function handleBackButton() {
        navigate("/");
    }


    return (
        <div className="treat-list-page">
            <div className="treat-list">
                <button className="back-button" onClick={handleBackButton}>back</button>
                <div className="title">Treat List</div>
                
                <div>
                    <input 
                        type="text"
                        placeholder="Enter a reward..."
                        value={newReward}
                        onChange={(e) => setNewReward(e.target.value)}
                    />
                    <button className="add-button" onClick={addReward}>Add</button>
                </div>

                <ol>
                    {rewards.map((reward, index) => (
                        <li key={reward.id}>
                            {editingIndex === index ? (
                                <>
                                    <input 
                                        type="text"
                                        value={editingValue}
                                        onChange={(e) => setEditingValue(e.target.value)}
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
                                </>
                            ) : (
                                <>
                                    <span className="text">{reward.description}</span>

                                    {/* COIN COST INPUT */}
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

                                    <div className='icon-container'>
                                        <img className="coin-icon" src={CoinIcon} />

                                        {/* Save cost button */}
                                        <img 
                                            className="check-icon" 
                                            src={CheckIcon}
                                            onClick={() => saveCost(reward)}
                                        />

                                        <img className="question-icon" src={QuestionIcon} />
                                    </div>

                                    <button 
                                        className="delete-button"
                                        onClick={() => deleteReward(reward.id)}
                                    >
                                        <DeleteIcon fontSize="small"/>
                                    </button>

                                    <button 
                                        className="edit-button"
                                        onClick={() => startEditing(index)}
                                    >
                                        <EditIcon fontSize='small'/>
                                    </button>
                                </>
                            )}
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
}
