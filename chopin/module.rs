use chopin::prelude::*;

#[chopin::module]
pub struct TwitterApp {
    tweets: StorageMap<u64, Tweet>,
    comments: StorageMap<u64, Vec<u64>>,
    likes: StorageMap<u64, Vec<Address>>,
    dislikes: StorageMap<u64, Vec<Address>>,
    retweets: StorageMap<u64, Vec<Address>>,
    user_profiles: StorageMap<Address, UserProfile>,
    tweet_keywords: StorageMap<String, Vec<u64>>, // New: Index tweets for search
    tweet_count: StorageValue<u64>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Tweet {
    id: u64,
    user: Address,
    content: String,
    parent_tweet: Option<u64>,
    timestamp: u64,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct UserProfile {
    username: String,
    avatar_url: String,
}

impl TwitterApp {
    #[chopin::endpoint]
    pub fn post_tweet(&mut self, sender: Address, content: String, parent_tweet: Option<u64>) {
        let tweet_id = self.tweet_count.get().unwrap_or(0) + 1;
        let tweet = Tweet { 
            id: tweet_id, 
            user: sender, 
            content: content.clone(), 
            parent_tweet, 
            timestamp: chopin::time::now()
        };
        
        self.tweets.insert(tweet_id, tweet);
        self.tweet_count.set(tweet_id);

        if let Some(parent) = parent_tweet {
            self.comments.entry(parent).or_default().push(tweet_id);
        }

        // Index keywords for search
        for word in content.split_whitespace() {
            self.tweet_keywords.entry(word.to_lowercase()).or_default().push(tweet_id);
        }

        chopin::emit_event("new_tweet", tweet_id); // Real-time event
    }

    #[chopin::endpoint]
    pub fn set_user_profile(&mut self, sender: Address, username: String, avatar_url: String) {
        let profile = UserProfile { username, avatar_url };
        self.user_profiles.insert(sender, profile);
    }

    #[chopin::endpoint]
    pub fn get_user_profile(&self, user: Address) -> Option<UserProfile> {
        self.user_profiles.get(&user).cloned()
    }

    #[chopin::endpoint]
    pub fn search_tweets(&self, keyword: String) -> Vec<Tweet> {
        self.tweet_keywords.get(&keyword.to_lowercase())
            .unwrap_or(&vec![])
            .iter()
            .filter_map(|id| self.tweets.get(id).cloned())
            .collect()
    }
}
