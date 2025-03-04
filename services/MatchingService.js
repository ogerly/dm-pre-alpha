/**
 * Calculate match score between two users
 * @param {Object} user1 - First user
 * @param {Object} user2 - Second user
 * @return {Object} - Score and matching details
 */
export function calculateMatchScore(user1, user2) {
  let score = 0;
  const matchDetails = {
    sharedInterests: [],
    complementarySkills: [],
    matchingAttributes: []
  };

  // Match shared interests (high importance)
  if (user1.interests && user2.interests) {
    const sharedInterests = user1.interests.filter(interest => 
      user2.interests.includes(interest)
    );
    
    matchDetails.sharedInterests = sharedInterests;
    score += sharedInterests.length * 10; // 10 points per shared interest
  }

  // Match complementary skills (medium importance)
  if (user1.skills && user2.skills) {
    const complementarySkills = user1.skills.filter(skill => 
      !user2.skills.includes(skill)
    );
    
    matchDetails.complementarySkills = complementarySkills;
    score += complementarySkills.length * 5; // 5 points per complementary skill
  }

  // Assess goals compatibility (bonus points)
  if (user1.goals && user2.goals) {
    const goalsSimilarity = calculateTextSimilarity(user1.goals, user2.goals);
    score += goalsSimilarity * 15; // Up to 15 points for similar goals
    
    if (goalsSimilarity > 0.3) {
      matchDetails.matchingAttributes.push({
        category: "Ziele",
        similarity: Math.round(goalsSimilarity * 100) + "%"
      });
    }
  }
  
  // Check DreamMall goals similarity
  if (user1.dreammallGoals && user2.dreammallGoals) {
    const dreamGoalsSimilarity = calculateTextSimilarity(user1.dreammallGoals, user2.dreammallGoals);
    score += dreamGoalsSimilarity * 20; // Up to 20 points for similar DreamMall goals
    
    if (dreamGoalsSimilarity > 0.3) {
      matchDetails.matchingAttributes.push({
        category: "DreamMall Ziele",
        similarity: Math.round(dreamGoalsSimilarity * 100) + "%"
      });
    }
  }
  
  // Check collaboration preferences
  if (user1.collaborationPreferences && user2.collaborationPreferences) {
    const collabSimilarity = calculateTextSimilarity(user1.collaborationPreferences, user2.collaborationPreferences);
    score += collabSimilarity * 15;
    
    if (collabSimilarity > 0.3) {
      matchDetails.matchingAttributes.push({
        category: "Zusammenarbeit",
        similarity: Math.round(collabSimilarity * 100) + "%"
      });
    }
  }
  
  // Check for similar projects/experiences
  if (user1.ownProjects && user2.ownProjects) {
    const projectSimilarity = calculateProjectSimilarity(user1.ownProjects, user2.ownProjects);
    score += projectSimilarity * 10;
    
    if (projectSimilarity > 0) {
      matchDetails.matchingAttributes.push({
        category: "Ähnliche Projekte",
        value: "Gemeinsamer Projektbereich"
      });
    }
  }
  
  // Check value orientation similarity
  if (user1.valueOrientation && user2.valueOrientation) {
    const valueSimilarity = calculateTextSimilarity(user1.valueOrientation, user2.valueOrientation);
    score += valueSimilarity * 10;
    
    if (valueSimilarity > 0.4) {
      matchDetails.matchingAttributes.push({
        category: "Werteorientierung",
        similarity: Math.round(valueSimilarity * 100) + "%"
      });
    }
  }

  return {
    score,
    matchDetails,
    percentage: Math.min(100, Math.round(score / 80 * 100)) // Normalize to percentage (max score raised to 80)
  };
}

/**
 * Calculate simple text similarity (0-1 scale)
 * @param {string} text1 - First text
 * @param {string} text2 - Second text
 * @return {number} - Similarity score (0-1)
 */
function calculateTextSimilarity(text1, text2) {
  const words1 = new Set(text1.toLowerCase().split(/\W+/).filter(w => w.length > 3));
  const words2 = new Set(text2.toLowerCase().split(/\W+/).filter(w => w.length > 3));
  
  let sharedWords = 0;
  
  words1.forEach(word => {
    if (words2.has(word)) {
      sharedWords++;
    }
  });
  
  const totalUniqueWords = new Set([...words1, ...words2]).size;
  
  return totalUniqueWords > 0 ? sharedWords / totalUniqueWords : 0;
}

/**
 * Check for similarity in projects
 * @param {Array} projects1 - First user's projects
 * @param {Array} projects2 - Second user's projects
 * @return {number} - Similarity score (0-1)
 */
function calculateProjectSimilarity(projects1, projects2) {
  if (!projects1.length || !projects2.length) return 0;
  
  let similarityScore = 0;
  
  // Compare project descriptions for similarity
  for (const p1 of projects1) {
    for (const p2 of projects2) {
      if (p1.description && p2.description) {
        const projectSimilarity = calculateTextSimilarity(p1.description, p2.description);
        similarityScore = Math.max(similarityScore, projectSimilarity);
      }
    }
  }
  
  return similarityScore;
}

/**
 * Get top matches for a user
 * @param {Object} targetUser - User to find matches for
 * @param {Array} allUsers - All available users
 * @param {number} limit - Maximum number of matches to return
 * @return {Array} - Array of users with match scores
 */
export function findTopMatches(targetUser, allUsers, limit = 5) {
  const matches = allUsers
    .filter(user => user.id !== targetUser.id)
    .map(user => ({
      ...user,
      matchResult: calculateMatchScore(targetUser, user)
    }))
    .sort((a, b) => b.matchResult.score - a.matchResult.score);
  
  return matches.slice(0, limit);
}
