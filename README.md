Clear picture.

## App tasks

### 1. Project setup

Create Angular + Capacitor app with routing and mobile-ready layout.

Need:

- Angular app
- Capacitor configured
- Android platforms prepared
- basic app shell
- bottom/top navigation if needed

---

### 2. Pages

#### Current ride page

Main active screen for tracking the ride.

Should include:

- start ride button
- pause/resume ride
- finish ride
- current distance
- current duration
- current speed
- GPS status
- map placeholder or simple coordinates view

---

#### Rides page

List of saved rides.

Should include:

- ride list from SQLite
- date/time
- distance
- duration
- average speed
- click to open ride preview
- empty state

---

#### Ride preview page

Details of one completed ride.

Should include:

- ride summary
- distance
- duration
- average/max speed
- start/end time
- saved GPS points
- simple route preview placeholder

---

### 3. SQLite integration

Add local database storage.

Need tables:

- `rides`
- `ride_points`

Store:

- ride id
- start time
- end time
- distance
- duration
- avg speed
- max speed
- GPS points with lat/lng/time/speed

---

### 4. GPS integration

Add GPS tracking plugin.

Need:

- ask location permission
- get current position
- watch position during active ride
- stop watching when ride ends
- handle permission denied
- handle GPS unavailable

---

### 5. Ride tracking logic

Create ride service.

Should handle:

- start ride
- pause ride
- resume ride
- finish ride
- calculate distance
- calculate duration
- calculate speed
- save ride to SQLite
- restore active ride if app was closed

---

### 6. Data models

Create interfaces for:

- `Ride`
- `RidePoint`

Example statuses:

- `idle`
- `active`
- `paused`
- `finished`

---

### 7. Mobile behavior

Handle app lifecycle.

Need:

- continue tracking when app is active
- save current ride state
- restore state after app reload
- show clear warning before finishing ride
- prevent data loss

---

### 8. UI states

Add simple states for:

- loading
- empty rides
- no GPS permission
- GPS searching
- active ride
- paused ride
- save error

---

### 9. Testing checklist

Check:

- app starts without GPS permission
- permission request works
- ride starts correctly
- points are saved
- pause stops adding distance
- resume continues tracking
- finish saves ride
- rides list shows saved ride
- preview opens correct ride
- app reload does not lose active ride
