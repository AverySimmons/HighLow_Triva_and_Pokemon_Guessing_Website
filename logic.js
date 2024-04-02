const new_question_button = document.getElementById("new_question_button");
const question_text = document.getElementById("question_text");
const guess_field = document.getElementById("guess_field");
const guess_button = document.getElementById("guess_button");
const stat_count = document.getElementById("stat_count");
const stat_average = document.getElementById("stat_average");

const pokemon_image = document.getElementById("pokemon_image");
const search_field = document.getElementById("search_field");
const search_button = document.getElementById("search_button");


let num_completed = 0;
let tot_guesses = 0;
let current_number = 0;
let current_text = "";

let win_screen = false;

function update_stats() {
    stat_count.textContent = "Completed: " + num_completed.toString();
    let average = Math.round(tot_guesses / num_completed * 1000) / 1000;
    stat_average.textContent = "Average Guesses: " + (average).toString();
}

function get_number(number, callback) {
    let api_url = "http://numberapi.com/" + number.toString();
    $.get(api_url, function(data) {
        callback(data);
    })
    .fail(function() {
        console.log("Numbers API fetch failed.");
    });
}

function generate_number() {
    let num_index = Math.floor(Math.random() * available_numbers.length);
    current_number = available_numbers[num_index];
    console.log(current_number);

    $("#highlow_section").empty();
    
    get_number(current_number, function(data) {
        current_text = data;
        let space_index = current_text.indexOf(' ');
        current_text = current_text.substring(space_index);
        available_numbers.splice(num_index, 1);
        current_text = current_text.slice(0, -1);
        current_text = "What" + current_text + "?";
        question_text.textContent = current_text;
    });
}

function take_guess() {
    if (guess_field.value == "" || win_screen) {guess_field.value = "";return;}

    let guess = parseInt(guess_field.value);
    guess = Math.min(9999, guess);
    guess = Math.max(0, guess);

    $("#highlow_section").prepend(high_low_guess_html);
    let current_entry = $("#highlow_section").children()[0];
    current_entry.children[0].textContent = guess.toString();
    
    if (guess == current_number) {
        current_entry.classList.add("highlow_entry_correct");
        current_entry.children[1].textContent = "★";
        num_completed++;

        win_screen = true
        question_text.classList.add("win_flash");
        let win_sound = new Audio("VictorySound.wav");
        win_sound.volume = 0.2;
        win_sound.play();
        setTimeout(function() {
            question_text.classList.remove("win_flash");
            win_screen = false;
            generate_number();
        }, 1820);
    }
    else {
        guess_field.classList.remove("wiggle_animation");
        void guess_field.offsetWidth;
        guess_field.classList.add("wiggle_animation");
        let wrong_answer_sound = new Audio("WrongAnswerSound.wav");
        wrong_answer_sound.volume = 0.2;
        wrong_answer_sound.play();

        if (guess < current_number) {
            current_entry.classList.add("highlow_entry_low");
            current_entry.children[1].textContent = "↑";
        }
        else {
            current_entry.classList.add("highlow_entry_high");
            current_entry.children[1].textContent = "↓";
        }
    }

    tot_guesses++;
    guess_field.value = "";
    update_stats();
}

function check_is_guessing(key) {
    if (key.key === 'Enter' || key.keyCode == 13) {
        take_guess();
    }
}

function get_pokemon(pokemon, callback) {
    let api_url = "https://pokeapi.co/api/v2/pokemon/" + pokemon;
    $.get(api_url, function(data) {
        callback(data);
    })
    .fail(function() {
        console.log("Not a Pokemon (or API fetch failed).");
    });
}

function search_pokemon() {
    let pokemon = search_field.value.toLowerCase();
    get_pokemon(pokemon, function(data) {
        pokemon_image.src = data.sprites.front_default;
    });
    search_field.value = "";
}

function check_is_searching(key) {
    if (key.key === 'Enter' || key.keyCode == 13) {
        search_pokemon();
    }
}

function play_hover_sound() {
    let hover_sound = new Audio("ButtonHoverSound.wav");
    hover_sound.volume = 0.2;
    hover_sound.play();
}

function play_click_sound() {
    let click_sound = new Audio("ButtonPressSound.mp3");
    click_sound.volume = 0.2;
    click_sound.play();
}

new_question_button.addEventListener("click", generate_number);
new_question_button.addEventListener("mouseenter", play_hover_sound);
new_question_button.addEventListener("mousedown", play_click_sound);
guess_field.addEventListener("keydown", check_is_guessing);
guess_button.addEventListener("click", take_guess);
guess_button.addEventListener("mouseenter", play_hover_sound);
guess_button.addEventListener("mousedown", play_click_sound);

search_field.addEventListener("keydown", check_is_searching);
search_button.addEventListener("click", search_pokemon);
search_button.addEventListener("mouseenter", play_hover_sound);
search_button.addEventListener("mousedown", play_click_sound);

update_stats();
generate_number();