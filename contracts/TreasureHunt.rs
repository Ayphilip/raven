use chopin::prelude::*;

#[chopin::module]
pub struct TreasureHunt {
    creator: Address,
    quest: String,
    answer_hash: String,
    reward: u64,
    reward_token: Address,
    winner: Option<Address>,
    guesses: StorageMap<Address, String>, // Stores user guesses
}

impl TreasureHunt {
    #[chopin::endpoint]
    pub fn new(creator: Address, quest: String, answer_hash: String, reward: u64, reward_token: Address) -> Self {
        Self {
            creator,
            quest,
            answer_hash,
            reward,
            reward_token,
            winner: None,
            guesses: StorageMap::new(),
        }
    }

    #[chopin::endpoint]
    pub fn submit_guess(&mut self, sender: Address, guess: String) {
        self.guesses.insert(sender, guess.clone());

        if guess == self.answer_hash {
            self.winner = Some(sender.clone());
            chopin::transfer(self.reward_token, sender, self.reward); // Transfer reward
            chopin::emit_event("winner_declared", sender);
        }
    }

    #[chopin::endpoint]
    pub fn get_guesses(&self) -> Vec<(Address, String)> {
        self.guesses.iter().collect()
    }
}
