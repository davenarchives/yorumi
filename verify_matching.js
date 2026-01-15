
// Mock of the matching logic in AnimeContext.tsx

// Helper to normalize strings for comparison
const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

// Helper to extract season number
const getSeason = (title) => {
    const match = title.match(/season\s*(\d+)|(\d+)(st|nd|rd|th)\s*season/i);
    return match ? parseInt(match[1] || match[2]) : 1;
};

// Helper to score closeness
const getScore = (candidate, target) => {
    let score = 0;
    const canTitle = candidate.title || '';
    const tgtTitle = target.title || '';

    console.log(`Comparing Candidate: "${canTitle}" (S${getSeason(canTitle)}, Y${candidate.year}) vs Target: "${tgtTitle}" (S${getSeason(tgtTitle)}, Y${target.year})`);

    // 1. Text Similarity
    if (normalize(canTitle).includes(normalize(tgtTitle)) || normalize(tgtTitle).includes(normalize(canTitle))) {
        score += 10;
        console.log("  +10 Text Similarity");
    }

    // 2. Season Matching
    const targetSeason = getSeason(tgtTitle) || (target.season ? 1 : 1);
    const candidateSeason = getSeason(canTitle);

    if (candidateSeason !== targetSeason) {
        if (targetSeason > 1 && candidateSeason === 1 && !canTitle.toLowerCase().includes('season')) {
            score -= 20;
            console.log("  -20 Season Mismatch (Target S" + targetSeason + " vs Candidate S1)");
        } else {
            score += 5; // Match? No wait, this else block logic in the main code said:
            // if (candidateSeason !== targetSeason) ...
            // Wait, I copied the logic incorrectly or the logic itself is weird in my head?
            // checking code:
            /*
           if (candidateSeason !== targetSeason) {
               if (targetSeason > 1 && candidateSeason === 1 && !canTitle.toLowerCase().includes('season')) {
                   score -= 20; 
               } else {
                    score += 5; // Match!  <-- THIS COMMENT IN CODE SAYS MATCH BUT IT IS INSIDE candidateSeason !== targetSeason
               }
           }
            */
            // Ah! If candidateSeason !== targetSeason, effectively it says:
            // If target is S2, and candidate is S1 (implicit), penalize.
            // Otherwise (e.g. target S1, candidate S2? Or target S2, candidate S3?), add 5? 
            // That seems wrong. Adding 5 for a mismatch?
            // Let's re-read the code I wrote.
        }
    } else {
        // Equal seasons
        // logic for equal season wasn't in the if (candidate !== target) block.
        // It was missing!
        // My code:
        /*
            // 2. Season Matching
            const targetSeason = getSeason(tgtTitle) || (target.season ? 1 : 1); 
            const candidateSeason = getSeason(canTitle);
            
            // Explicit Season Mismatch is a huge penalty
            if (candidateSeason !== targetSeason) {
                if (targetSeason > 1 && candidateSeason === 1 && !canTitle.toLowerCase().includes('season')) {
                    score -= 20; 
                } else {
                     score += 5; // Match! <-- This implies if season is DIFFERENT, we add 5? NO.
                }
            }
        */
        // I BROKE THE LOGIC IN THE IMPLEMENTATION.
        // If candidateSeason !== targetSeason, it should PENALIZE or be NEUTRAL, definitively NOT +5.
        // +5 should be if (candidateSeason === targetSeason).

        // I need to Fix the logic in AnimeContext.tsx too!
    }

    // Let's verify the logic I actually wrote:
    if (candidateSeason === targetSeason) {
        score += 10; // I should add this.
        console.log("  +10 Season Match");
    } else {
        // Mismatch
        if (targetSeason > 1 && candidateSeason === 1 && !canTitle.toLowerCase().includes('season')) {
            score -= 20;
            console.log("  -20 Start mismatch");
        }
    }

    // 3. Year Matching
    if (candidate.year && target.year) {
        const yearDiff = Math.abs(parseInt(candidate.year) - target.year);
        if (yearDiff <= 1) {
            score += 5;
            console.log("  +5 Year Match");
        }
        else if (yearDiff > 2) {
            score -= 10;
            console.log("  -10 Year Mismatch");
        }
    }

    // 4. Type Matching
    if (candidate.type && target.type) {
        if (candidate.type.toLowerCase() === target.type.toLowerCase()) {
            score += 3;
            console.log("  +3 Type Match");
        }
    }

    console.log("  = Total Score: " + score);
    return score;
};

// Test Cases
const targetJJK3 = {
    title: "Jujutsu Kaisen Season 3: The Culling Game",
    title_english: "Jujutsu Kaisen Season 3",
    year: 2025, // Assuming future
    type: "TV"
};

const candidates = [
    { title: "Jujutsu Kaisen", year: "2020", type: "TV", session: "s1" },
    { title: "Jujutsu Kaisen (TV)", year: "2020", type: "TV", session: "s1_tv" },
    { title: "Jujutsu Kaisen Season 2", year: "2023", type: "TV", session: "s2" },
    { title: "Jujutsu Kaisen: Culling Game", year: "2025", type: "TV", session: "s3_real" }, // Ideal match
    { title: "Jujutsu Kaisen 0 Movie", year: "2021", type: "Movie", session: "movie" }
];

console.log("--- Running Matches ---");
candidates.forEach(c => getScore(c, targetJJK3));
