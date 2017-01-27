var User = function User(account_id, points, bestStreak, persona_name) { 
    this.account_id = account_id || 0;
    this.points = points || 0;
    this.bestStreak = bestStreak || 0;
    this.persona_name = persona_name || '';
}

module.exports = User;