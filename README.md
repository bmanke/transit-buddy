# Transit Buddy [[Hack-a-ton with Friends entry]](https://hack-a-ton-with-friends.devpost.com/)


### Introduction
Hi, we're Transit Buddy, and here's our problem: only 61% of Edmonton transit riders felt safe on their last trip, and safety is the number one reason people avoid ETS entirely. Students can't opt out — the LRT is how they get to class. Right now, their only options are ride alone or don't go.

Our solution is safety in numbers, powered by software. Students enter their line, direction, and departure time — Transit Buddy matches them with others on the same train, so nobody rides alone. During the trip, they share live 'I'm on the train' check-ins with friends and family, and one tap surfaces ETS's real Transit Watch number and station emergency info. Everything else out there is transit tracking; nothing connects riders to each other.

Here's why we can build it this weekend: the core is a matching engine — route, direction, time window — over a simple backend, with a map view and check-in flow on top. ETS publishes its routes and schedules as open data, so we're not scraping anything. The MVP demo writes itself: two phones, one match, live trip status, one-tap safety button.

The impact is real and local: 320,000 Edmontonians ride ETS every weekday, and post-secondary students are its heaviest users. Cities spend millions on peace officers and cameras — Transit Buddy attacks the problem from the other side, with community. Judges, everyone in this room has had a moment on transit when they wished someone was with them. We're that someone. Nobody rides alone.

### Tech Stack:
- Language: React with React-Router using TypeScript
- Database: Supabase
- Frontend: TailwindCSS

### Features:
- QR Code generation (Creates buddy connection, ID System): 
    > Handles sharing information: Meetup times, meetup location, target destination, and availability.
- Form inputs (Text field inputs, dropdowns, checklist)
- Sign in verification (Email sign in)
    > Requires a valid Email account to sign in.
- Map data
    > Allows users to verify connection and destination.
- "Buddies" list
    > Pre-saved buddies to allow quick selection and reduce manual input.


### What data is handled and why:
- Account verification - Required to sign in and verify a valid email account.
- Location Data - Used to create and share a meetup, and destination location.
- Time - Used to ensure meetup with "buddy" can be done within a specific time frame.
- LRT route data - Used to help user and "buddy" verify proper routes.
- "Buddies" list - Allows user to have a pre-configured list of "buddies" to choose from.

### How is data stored:
- Supebase DB (Meet up locational data, user data)

### User Navigation:
**Step 1: Sign in**
- Email account Sign in required (Security)
    > User signs in with valid email account.

**Step 2: Input required data**
    > User chooses between two options(Option 1 or Option 2).

Option 1 (Create a meetup):
- Meet up spot (Target location to meet up)
    > Dropdown or checklist
- Time selection (Meetup times) 
    > Time selection wheel or Dropdown (pre-configured times)
- Destination location
    > Dropdown or checklist

Option 2 (Recieve a meetup):
- Scan a QR code
- Be presented with shared meetup.

**Step 3: Verify data**
- Train routes (LRT) are correct?
- Connection and meet-up point are correct?
- Start points, end point, start/end times are correct?

**Step 4: Confirmation and save data**
- Submit form after confirming data is correct and filled.
- Save information to supabase DB.
- Generate QR code to allow sharing.

---
## Team
| Names | Feature |
| :--- | :--- |
| Pixel-bug-eater | Meetups |
| bmanke | QR Code & Friends list |
| shape-warrior-t | Database setup |

### Why this project exists:
- Contributes to safe travel procedures by providing a meetup system.
