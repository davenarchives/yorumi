
// Mock of the matching logic - CORRECTED

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

    if (candidateSeason === targetSeason) {
        score += 10;
        console.log("  +10 Season Match");
    } else {
        // Mismatch
        if (targetSeason > 1 && candidateSeason === 1 && !canTitle.toLowerCase().includes('season')) {
            score -= 20;
            console.log("  -20 Season Mismatch (Target S" + targetSeason + " vs Candidate S1)");
        }
        // No penalty otherwise, just lack of bonus
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
    year: 2025,
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
