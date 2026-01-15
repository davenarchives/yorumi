
// Mock of the matching logic - WITH SUBTITLE FIX

const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

const getSeason = (title) => {
    const match = title.match(/season\s*(\d+)|(\d+)(st|nd|rd|th)\s*season/i);
    return match ? parseInt(match[1] || match[2]) : 1;
};

const getScore = (candidate, target) => {
    let score = 0;
    const canTitle = candidate.title || '';
    const tgtTitle = target.title || '';

    console.log(`Comparing Candidate: "${canTitle}" (S${getSeason(canTitle)}, Y${candidate.year}) vs Target: "${tgtTitle}" (S${getSeason(tgtTitle)}, Y${target.year})`);

    // 1. Text Similarity
    const normCan = normalize(canTitle);
    const normTgt = normalize(tgtTitle);
    if (normCan.includes(normTgt) || normTgt.includes(normCan)) {
        score += 10;
        console.log("  +10 Text Similarity");
    }

    // 2. Season Matching
    const targetSeason = getSeason(tgtTitle) || (target.season ? 1 : 1);
    const candidateSeason = getSeason(canTitle);
    const candidateHasSeason = canTitle.toLowerCase().includes('season');

    if (candidateSeason === targetSeason) {
        score += 5;
        console.log("  +5 Season Match");
    } else {
        // Mismatch
        if (targetSeason > 1 && candidateSeason === 1 && !candidateHasSeason) {
            // Target is Season 2+, candidate looks like Season 1 (no "Season" in title)

            // FIX: If year matches and text is very similar (substring), maybe it's just a subtitle?
            // E.g. "Jujutsu Kaisen: Culling Game" (S1) vs "Jujutsu Kaisen Season 3: The Culling Game" (S3)

            let isSafe = false;
            // Check year match
            if (candidate.year && target.year) {
                const yearDiff = Math.abs(parseInt(candidate.year) - target.year);
                if (yearDiff <= 1) {
                    // Check if candidate title is contained in target title (minus "Season X")
                    // Actually we already checked inclusion above.
                    if (normTgt.includes(normCan)) {
                        isSafe = true;
                    }
                }
            }

            if (isSafe) {
                console.log("  (Ignored Season Mismatch Penalty due to Year + Substring Match)");
            } else {
                score -= 20;
                console.log("  -20 Season Mismatch (Target S" + targetSeason + " vs Candidate S1)");
            }

        } else if (candidateSeason !== targetSeason) {
            score -= 20;
            console.log("  -20 Explicit Season Mismatch");
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
        if (candidate.type.toLowerCase() === target.type.toLowerCase()) score += 3;
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
    { title: "Jujutsu Kaisen Season 2", year: "2023", type: "TV", session: "s2" },
    { title: "Jujutsu Kaisen: Culling Game", year: "2025", type: "TV", session: "s3_candidate" }, // The one we want
    { title: "Jujutsu Kaisen 0", year: "2021", type: "Movie", session: "movie" }
];

console.log("--- Running Matches ---");
candidates.forEach(c => getScore(c, targetJJK3));
