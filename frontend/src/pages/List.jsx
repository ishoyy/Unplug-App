import { useState, useEffect } from 'react';
import "../components/List.css"
import { db, auth } from "../../../FirebaseConfig"
import { 
    collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot 
} from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { useAuthState } from "react-firebase-hooks/auth";

export default function List() {

    const [rewards, setRewards] = useState([]);
    const [newReward, setNewReward] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingValue, setEditingValue] = useState("");
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
    // Save edited reward
    // -------------------------
    async function saveReward(reward) {
        const ref = doc(db, "users", user.uid, "rewards", reward.id);
        await updateDoc(ref, { description: editingValue });

        setEditingIndex(null);
        setEditingValue("");
    }

    function startEditing(index) {
        setEditingIndex(index);
        setEditingValue(rewards[index].description);
    }

    function cancelEdit() {
        setEditingIndex(null);
        setEditingValue("");
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
                                        onClick={cancelEdit}
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span className="text">{reward.description}</span>
                                    <button 
                                        className="delete-button"
                                        onClick={() => deleteReward(reward.id)}
                                    >
                                        Delete
                                    </button>
                                    <button 
                                        className="edit-button"
                                        onClick={() => startEditing(index)}
                                    >
                                        Edit
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
