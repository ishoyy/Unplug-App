
# <p align="center"> Unplug 🗓️🍬 </p>
<p>
<img width="1441" height="750" alt="image" src="https://github.com/user-attachments/assets/96b7b504-2fe7-473e-98eb-5f22c99bb585" />
<p>
  <img width="1441" height="750" alt="image"  src="https://github.com/user-attachments/assets/9f6e086d-136f-48f8-996d-afa55951c169" />
</p>


## 📖  Table of contents

* [Introduction](#introduction)
* [Installation](#installation)
* [Features to be added](#features-to-be-added)
* [Known issues and limitations](#known-issues-and-limitations)

 <img width="200" height="200" align="right" alt="image"  src="https://github.com/user-attachments/assets/4b518f6b-3ae5-4238-aca9-82b7bdbe9d0b" />



## 🌟 Introduction

Unplug aims to help users create positive lifestyle changes by:
- Providing a record-keeping system for tracking progress by allowing users to "check-in" daily on a calendar
- Incentivize progress by rewarding users with coins earned for checking in
- Allowing users to create personal rewards that can be earned by using accumulated coins, encouraging motivation and long-term engagement

This project is the online manifestation of constantly thinking to yourself things like: 
_"If I limit my spending for the next two weeks, I'll buy myself that cute anime figurine!"_ 
or
_"If I start eating healthy, I'll host a party with my friends"_
or
_"If I stop scrolling on my phone all the time from now on, I get to to rub it in my friends face!!!!"_

Whether you're trying to quit an annoying habit or trying to enforce new ones, Unplug is a fun, simple way to push you to meet your goals. The power to unplug yourself from whatever is holding you back is in your hands.



## 🧰 Installation

1. Prerequisites: 

Ensure the following tools are installed on your system:

Node.js (v18 or above)
npm (v8 or above)

2. Clone the repository
```
git clone https://github.com/EECS3311F25/UnPlug-App.git
```

3 Install dependencies

```
cd backend && npm install
cd ../frontend && npm install
```

6. Run the frontend (in new terminal)
   
```
cd frontend
npm run dev
```

7. View the app

Open the URL shown in your terminal (usually http://localhost:5173).

## 💡 Features to be added

- A 'fridge' to store all your earned rewards that are bought from your accumulated coins. You don't want to forget about your hard-earned rewards!
- Customizable pets with healthbars that adjust according to user progress; the more you check-in for the days you abstain/enforce a habit, the healthier your pet is! Adds another layer of accountability for those who need it!
- A cleaner, modern UI while still sticking to the classic pixel-game theme
- Make earned coin amount proportional to the number of days user checks in on the calendar. Gradual increase in earned coins builds up long-term commitment.
- Implement a Streaks feature to track continuous period of successful check-ins
- User can create and display their goal on the homepage to remind them of what they're staying on track for

## 🤔 Known issues and limitations

- Rewards created by user are not sorted in the order that they are created
- Users should not be able to check-in for days that are not the current date. This limitation is temporary though, since being able to check-in for past days is useful for testing the featurea of the application for the current release.

## Contact

If you'd like to get in touch or give any feedback, please do so at the following email: ishaarifx@gmail.com
