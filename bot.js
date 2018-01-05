const Twit = require('twit'); // Include Twit Package
const config = require('./config'); // Include authentication credentials
const fs = require('fs'); // Include file manipulation
const path = require('path');

const bot_name = 'kula_the_korok';
const bot_screen_name = 'Kula';
const bot_owner_name = 'Owlluin';

let koroksFound = 0;
let daysAdventuring = 0;

/** Messages to tweet out **/
// Kula finds a korok
const kulas_koroks = [
  "Yahaha! I found you! #BreathoftheWild #korok",
  "I'll show you the way back home! #BreathoftheWild #korok",
  "Did Mr. Hero come by here already? #BreathoftheWild #korok",
  "I was looking for you! #BreathoftheWild #korok",
  "Do you want this Chickaloo Tree Nut I found? #BreathoftheWild #korok",
  "Look who it is! #BreathoftheWild #korok",
  "That was a nice hiding spot! #BreathoftheWild #korok",
  "Do you want to go exploring with me? #BreathoftheWild #korok",
  "Let's go to my favorite tree! #BreathoftheWild #korok",
  "I'm glad you're safe from all those monsters! #BreathoftheWild #korok",
  "My friend told me I would find you here! #BreathoftheWild #korok"
];
// Kula updates friends on his journey
const kulas_updates = [
  "I hope to see Mr. Hero again soon.",
  "Twee hee!",
  "*yawn* I was having such a nice dream...",
  "I wonder if Blupees sparkle because they're too full of rupees...",
  "Oh no, I think I'm lost!",
  "Mr. Hero's glowy sword is so cool!",
  "I wanna be just like Mr. Hero someday!",
  "Where did everyone go!? Oh, there they are! Twee hee!",
  "I can see everything from up here!",
  "The weather is so nice today. I wonder where I should go.",
  "It's dark under here!",
  "Oh, it's gonna rain soon!",
  "I ate 5 minutes ago..but I'm still hungry!",
  "Have you ever seen a Blupee? I have!",
  "Do you know where my friends are hiding? I don't!",
  "Wh-what's that!? Something scary!",
  "Whee! Spinning is fun!",
  "Kula is sleepy. Zzz...",
  "What time is it!? It's Mr. Hero time!",
  "This sultry shroom will warm your bones. It makes its home in warmer zones.",
  "Its scales and tail will zap you, no doubt! This shocking swimmer is called a...fish.",
  "If stepped on by this, you will go poof! It starts with an H and ends with an oof!",
  "I think I just saw Hestu dancing again!",
  "I hear some maracas, could it be Hestu?",
  "I hope I don't lose my korok seed.",
  "I wonder what that glowing building in the distance is...",
  "What a tall tower, it's even taller than the Great Deku Tree!",
  "Ouch! Where did that rock come from?!"
];
// Kula gets a new follower and friend
const kulas_new_friend = [
  "Kula wants to be friends too!",
  "Come play with me and my friends!",
  "You remind me of Mr. Hero!",
  "It's nice to meet you! Twee hee!",
  "I found this apple for you!",
  "Let's go to the Korok Forest!",
  "Let's play hide and seek!"
];
// Kula is told to stop following someone
const unfollow_kula = [
  "I hope you have a good adventure.",
  "Buh-bye!",
  "Do your best, Mr. Hero!",
  "I hope we meet again soon!",
  "I'll meet you back at Korok Forest!"
];
// Kula congratulates a traveler
const achievement_kula = [
  "Sparkly! Shiny! You were able to do it!",
  "Kula is very proud of you!",
  "Twee hee! I like it!",
  "Wow! You remind me of Mr. Hero!",
  "Yahaha! You did it!"
];
// Kula comforts a sad traveler
const comforting_kula = [
  "If you're not feeling well, you could always use a magic rod!",
  "Kula is here for you",
  "Don't give up! I know you can do it!",
  "We koroks never give up and like to start each day fresh!"
];
// Kula protects a scared traveler
const protecting_kula = [
  "Mr. Hero will protect you with his glowy sword!",
  "It is always safe in Korok Forest!",
  "Kula won't let anything bad happen to you!"
];

/** List of words Kula responds to **/
const unfollow_kula_list = [
  "burn hestu",
  "I hate koroks",
  "I travel alone",
  "I'm leaving",
  "Stop messaging me",
  "Go Away",
  "I hate you",
  "You suck",
  "burn the koroks",
  "burn the forest",
  "please stop kula",
  "bye kula"
];
const achievement_words_list = [
  "victory",
  "won",
  "finished",
  "completed",
  "beat",
  "conqured",
  "aced",
  "perfected",
  "received",
  "graduated",
  "achieved",
  "succeeded",
  "built",
  "created"
];
const sad_words_list = [
  "sad",
  "unhappy",
  "upset",
  "failed",
  "defeat",
  "loser",
  "grief",
  "lonely",
  "helpless",
  "hopeless",
  "pointless",
  "failed",
  "failure",
  "defeat",
  "pain",
  "hurt"
];
const scared_words_list = [
  "scared",
  "horrified",
  "scary",
  "panic"
];

// Set up tweet time interval
const KOROK_INTERVAL = 1000 * 60 * 60 * 24; // every day
const ADVENTURE_INTERVAL = 1000 * 60 * 60 * 5; // every 5 hours

// Start Kula's Adventure and Timer
const kula = new Twit(config);

const kulas_journey = kula.stream('user'); // Setting up a user stream
kulas_journey.on('tweet', tweetEvent); // Anytime a tweet enters the stream, run tweetEvent
kulas_journey.on('follow', followed); // Anytime a user follows Kula, run followed

const kulas_adventure = kula.stream('statuses/filter', { // Set up stream to search for keywords
  track: ['korok', 'Hestu']
});
kulas_adventure.on('tweet', travelerEvent);


console.log("Kula is awake...");

console.log('Opening folder...');
fs.readdir(__dirname + '/koroks', function(err, files) {
  console.log('reading files...');
  if (err) {
    console.log('Error in the forest...');
    console.log(err);
  }
  else {
    let korokImages = [];
    files.forEach(function(f) {
      korokImages.push(f);
    });
    console.log("Looked at list of Koroks to find...");
    setInterval(function() {
      FindKoroks(korokImages);
    }, KOROK_INTERVAL);
  }
});

setInterval(GoOnAdventures, ADVENTURE_INTERVAL);

// Kula posts about friends he finds everyday!
function FindKoroks(korokImages) {
  console.log('Finding a korok...');
  let image_name = random_from_koroks(korokImages);
  let image_path = path.join(__dirname, '/koroks/' + image_name);
  let newPath = path.join(__dirname, '/found_koroks/' + image_name);
  let b64content = fs.readFileSync(image_path, { encoding: 'base64' });
  koroksFound++;
  daysAdventuring++;

  console.log('Uploading an image...');

  kula.post('media/upload', { media_data: b64content }, function (err, data, response) {
    if (err) {
      console.log('ERROR:');
      console.log(err);
    }
    else {
      console.log('Image uploaded!');
      console.log('Now tweeting it...');

      kula.post('statuses/update', {
        status: KulaSays(kulas_koroks),
        media_ids: new Array(data.media_id_string)
      },
        function(err, data, response) {
          if (err) {
            console.log('ERROR:');
            console.log(err);
          }
          else {
            console.log('Posted an image!');
          }
        }
      );
    }
  });

  // Move korok image to a different folder so as not to select again
  fs.rename(image_path, newPath, function (err) {
    if (err) {
      console.log('ERROR: unable to move image ' + image_path);
    }
    else {
      console.log('Kula checked korok off the list...');
      console.log('Image ' + image_path + ' was moved to ' + newPath);
    }
  });

  // If there are no more korok images, move all images back into selection
  if (korokImages.length === 0) {
    console.log('Kula found all the koroks!');
    for (let i = 0; i < koroksFound; i++) {
      // move back to ./koroks/
      fs.rename(newPath, image_path, function (err) {
        if (err) {
          console.log('ERROR: unable to move image ' + image_path);
        }
        else {
          console.log('Kula checked korok off the list...');
          console.log('Image ' + image_path + ' was moved to ' + newPath);
        }
      });
    }
    koroksFound = 0;
    console.log('Kula begins his journey again...');
  }
}

// Select a random picture of a korok
function random_from_koroks(korokImages) {
  return korokImages[Math.floor(Math.random() * korokImages.length)];
}


// Kula likes to talk about his adventures
function GoOnAdventures() {
  let kulasUpdate = KulaSays(kulas_updates);
  KulaTweets(kulasUpdate);
  console.log('Kula updated his adventure!');
}


// Kula likes to engage in conversations with his friends
function tweetEvent(tweet) {
  let from = tweet.user.screen_name; // Who sent the tweet
	let text = tweet.text; // Message of the tweet
	let reply_to = tweet.in_reply_to_screen_name; // Who tweet was @reply to

  if (tweet.user.screen_name != bot_name) { // Make sure Kula did not make the tweet
    if (!tweet.retweeted) { // Make sure the tweet is an original tweet
      if(!tweet.possibly_sensitive) { // Make sure tweet does not link to mature content
        // uncomment to like any tweet made from followers and @bot
        /*kula.post('favorites/create', {
          id: tweet.id_str
        });
        console.log('Kula liked a tweet!');*/

        // parse tweet to figure out a response
        text = text.replace(/[^a-zA-Z\s]/gi, "").toLowerCase();
        let tweet_words = text.split(' ');

        if (reply_to !== null && reply_to === bot_name) { // If the tweet was @reply to Bot
          // Kula encourages those going on journey alone
    			for (let j = 0; j < unfollow_kula_list.length; j++) { // For each word in the unfollow list
    				if (text.indexOf(unfollow_kula_list[j]) != -1) { // If an unfollow word is in the tweet
    					let unfollow_text = '@' + from + ' ' + KulaSays(unfollow_kula);
    					console.log('Someone wanted to unfollow...');
    					KulaTweets(unfollow_text); // Tweet an unfollow response
    					kula.post('friendships/destroy', { screen_name: from }, function(err, data, response) { // Unfollow the user
    						if (err) {
    							console.log(err);
    							KulaTweets('@' + from + ' Something\'s wrong with ' + bot_screen_name + '\'s plan. Ask @' + bot_owner_name + ' to help me unfollow you, please.');
    						}
    					});
              console.log('Kula unfollowed ' + from);
              return false;
    				}
    			}

          // Tweet was to Kula and is not to unfollow, so Kula likes it
          kula.post('favorites/create', {
            id: tweet.id_str
          });
          console.log('Kula liked a tweet!');

          // Kula chats with a traveler
    			for (let k = 0; k < tweet_words.length; k++) { // For each word in the tweet

            if (achievement_words_list.indexOf(tweet_words[k]) != -1) { // If an achievement word is in the tweet
    					let good_job_text = '@' + from + ' ' + KulaSays(achievement_kula);
              console.log(good_job_text);
    					KulaTweets(good_job_text);
              console.log('Kula was proud of a traveler!');
    				} else if (sad_words_list.indexOf(tweet_words[k]) != -1) { // If a sad word is in the tweet
    					let comforting_text = '@' + from + ' ' + KulaSays(comforting_kula);
    					KulaTweets(comforting_text);
              console.log('Kula comforted a sad traveler!');
    				} else if (scared_words_list.indexOf(tweet_words[k]) != -1) { // If a scared word is in the tweet
              let protecting_text = '@' + from + ' ' + KulaSays(protecting_kula);
    					KulaTweets(protecting_text);
              console.log('Kula protected a scared traveler!');
            }

    			}
    		}
      }
    }
  }
}


// Kula likes to make new friends
function followed(follow) {
  let follower_name = follow.source.screen_name;
  if (follower_name !== bot_name) {
    let greeting = '@' + follower_name + ' ' + KulaSays(kulas_new_friend);
    KulaTweets(greeting);
    console.log('Kula greeted a traveler!');
    kula.post('friendships/create', {
      screen_name: follower_name
    }, (err, data, reponse) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Kula made friends with ' + follower_name);
      }
    });
  }
}


// Kula meets many travlers on his adventure
function travelerEvent(tweet) {
  if (tweet.user.screen_name != bot_name) {
    if (!tweet.retweeted) {
      if(!tweet.possibly_sensitive) {
          kula.post('favorites/create', {
            id: tweet.id_str
          });
          console.log('Kula met a travler and liked their tweet...');
          console.log(tweet.text);
      }
    }
  }
};


// Sometimes Kula talks to himself
function KulaTweets(msg) {
  let tweet = {status: msg};

  kula.post('statuses/update', tweet, (err, data, response) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Tweeted: ' + msg);
    }
  });
}


// Koroks think about a lot of things
function KulaSays(kulas_thoughts) {
  let kula_picks = Math.floor(Math.random()*kulas_thoughts.length);
  let kula_says = kulas_thoughts[kula_picks];
  return kula_says;
}
