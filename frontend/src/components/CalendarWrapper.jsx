import Calendar from 'react-calendar';
import './CalendarWrapper.css';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { doc, setDoc, collection, onSnapshot, updateDoc, deleteDoc,increment, getDocs} from 'firebase/firestore';
import { db, auth} from "../../../FirebaseConfig"
import { useAuthState } from "react-firebase-hooks/auth";
import { onAuthStateChanged } from 'firebase/auth';
import Candy from "../images/candy.png";

const CheckInButton = styled(Button)({
  backgroundColor: '#ffb235f8',
  color: '#7e270aff',
  fontWeight: 'bold',
  fontFamily: 'courier',
  borderRadius: '12px',
  padding: '10px 24px',
  marginTop: '20px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  marginLeft: '45vw',
  marginTop: '15vh',
  zIndex:"1001",
  '&:hover': {
    backgroundColor: '#ffd633',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
  },
});



export default function CalendarWrapper() {
  const [date, setDate] = useState(new Date());
  const [checkins, setCheckins] = useState([]);
  const [user] = useAuthState(auth);

  const formatDate = (d) => d.toISOString().split('T')[0];
  const selectedDateStr = formatDate(date);
  const isCheckedIn = user && checkins.includes(selectedDateStr);


  // write a check-in document for today
  async function handleCheckIn() {


    if (user) {
    // build a reference to a document path
    // users/{userID}/checkins/{selectedDateStr}
    // checkin -> create date that has its own documnt ID
    const checkInRef = doc(db, "users", user.uid, "checkins", selectedDateStr);

      
    try {
        // write data to the document at checkInRef {users/{userID}/checkins/{selectedDateStr}}
          await setDoc(checkInRef, {
                checkedin: true,
              }, {merge:true});

      } catch(err){
        console.log("Check-in failed");
      }



    }


    // if the previous paramater does not include the selected date string, return the array of checkins included prev + sDS
  setCheckins(prev => {
    if (!prev.includes(selectedDateStr)) return [...prev, selectedDateStr];
    return prev;
  });


    const userRef = doc(db,"users", user.uid);

    try {
        await setDoc(userRef,{
            totalCoins: increment(5),
        },{merge:true});
    } catch(err){
      console.log("Saving total coin count failed");
    }

  }

  // when a user is logged in, listen ot their check-ins collections
  useEffect(() => {
 
      if (user){
      const ref = collection(db, "users", user.uid, "checkins");
      const unsub = onSnapshot(ref, (snap) => {
          const days = snap.docs.map((doc) => doc.id);
         setCheckins(days);

      },
          (err) => console.error('Snapshot error',err)
  );
        return () => unsub();

      }
  },[user])


  // when disconnecting from data in firebase, set checkins to be an emptu arrau
    useEffect(()=> {
      const unsub = onAuthStateChanged(auth, (u) => {
        setCheckins([]);
      });

      return () => unsub();
    },[]);



async function handleResetCheckins() {
  if (!user) return;

  try {
    const checkinsRef = collection(db, "users", user.uid, "checkins");

    // get all check-in documents
    const snapshot = await getDocs(checkinsRef);

    // delete each document
    const deletions = snapshot.docs.map(d => 
      deleteDoc(doc(db, "users", user.uid, "checkins", d.id))
    );

    await Promise.all(deletions);

    // reset React state so UI updates immediately
    setCheckins([]);
    
    console.log("All check-ins deleted.");
  } catch (err) {
    console.error("Failed to reset check-ins:", err);
  }

        const userRef = doc(db,"users", user.uid);

  try {
        await updateDoc(userRef,{
            totalCoins:0,

        });


  }catch(err){
    console.log("Failed reset totalCoins")
  }
}




  return (
    <div>
    <div className="calendar-container">
  <Calendar
    maxDate={new Date()}
    minDetail="year"
    onChange={setDate}
    value={date}
    tileClassName={({ date: tileDate, view }) => {
      if (view !== 'month') return null;

      const dateStr = tileDate.toISOString().split('T')[0];

      if (checkins.includes(dateStr)) {
        return 'checked-in-tile'; // highlight checked-in days
      }

      if (tileDate.toDateString() === new Date().toDateString()) {
        return 'today-highlight'; // highlight today
      }

      return null;
    }}
  />
</div>


      <div className="checkin-btn-container">
      <CheckInButton className="checkin-btn" onClick={handleCheckIn} disabled={isCheckedIn}>
        {isCheckedIn ? 'CHECKED IN' : 'CHECK IN'}
      </CheckInButton>

      </div>
       <button className="reset-button" onClick={handleResetCheckins}>RESET</button>
    </div>
  );
}
