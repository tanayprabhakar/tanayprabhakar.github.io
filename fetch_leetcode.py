import requests
import json

def fetch_leetcode_stats(username):
    url = "https://leetcode.com/graphql/"
    
    # Query for Solved stats and Ranking
    query_stats = """
    query userSessionProgress($username: String!) {
      allQuestionsCount {
        difficulty
        count
      }
      matchedUser(username: $username) {
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
        profile {
          ranking
        }
      }
    }
    """
    
    # Query for Skill stats (topics)
    query_skills = """
    query skillStats($username: String!) {
      matchedUser(username: $username) {
        tagProblemCounts {
          advanced {
            tagName
            problemsSolved
          }
          intermediate {
            tagName
            problemsSolved
          }
          fundamental {
            tagName
            problemsSolved
          }
        }
      }
    }
    """
    
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0"
    }
    
    # Fetch Stats
    res_stats = requests.post(url, json={"query": query_stats, "variables": {"username": username}}, headers=headers)
    data_stats = res_stats.json()
    
    # Fetch Skills
    res_skills = requests.post(url, json={"query": query_skills, "variables": {"username": username}}, headers=headers)
    data_skills = res_skills.json()
    
    # Process Stats
    ac_submissions = data_stats['data']['matchedUser']['submitStats']['acSubmissionNum']
    solved = {item['difficulty']: item['count'] for item in ac_submissions}
    ranking = data_stats['data']['matchedUser']['profile']['ranking']
    
    # Process Skills
    tags = data_skills['data']['matchedUser']['tagProblemCounts']
    all_topics = []
    for level in ['advanced', 'intermediate', 'fundamental']:
        if tags.get(level):
            all_topics.extend(tags[level])
    
    all_topics.sort(key=lambda x: x['problemsSolved'], reverse=True)
    top_topics = ", ".join([t['tagName'] for t in all_topics[:8]])
    
    result = {
        "solvedTotal": solved.get('All', 0),
        "easy": solved.get('Easy', 0),
        "medium": solved.get('Medium', 0),
        "hard": solved.get('Hard', 0),
        "rank": ranking,
        "topTopics": top_topics
    }
    
    with open('assets/data/leetcode.json', 'w') as f:
        json.dump(result, f, indent=2)
        
    print("Successfully fetched and saved LeetCode stats.")

if __name__ == "__main__":
    fetch_leetcode_stats("tanayprabhakar")
