# AlgoRacer
A fun game to learn CS Algorithms!

## Backend
Contained here is relevant information for the backend of the application
### Util Functions
* `checkAndTrim(str: any, label: String)`
* `checkEmailAndTrim(email: any)`
* `validateMongoId(testId: String)`
* `toObjectId(str_id: String)`
* `checkNumber(num: any, label: String)`

### Data Functions
* **users.js**
  * `async createUser(email: String, password: String, displayName: string)`
  * `async getUser(id: String)`
  * `async changePassword(userId: String, newPassword: String)`
  * `async changeDisplayName(userId: String, newPassword: String)`
  * `async updateStats(userId: String, difficulty: String, time_taken: Number, got_score: Number)`
* **leaderboard.js**
  * `async createLeaderboard(name: String)`
  * `async getLeaderboardById(leaderboardId: String)`
  * `async getLeaderboardByName(name: String)`
  * `async getAllLeaderboards()`
  * `async addToLeaderboard(userId: String, leaderboardName: String, time_taken: Number, got_score: Number, run_timestamp: Number)`