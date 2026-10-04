export interface Judge0Language {
  id: number;
  name: string;
  defaultCode: string;
}

export const JUDGE0_LANGUAGES: Judge0Language[] = [
  {
    id: 71,
    name: "Python 3 (3.8.1)",
    defaultCode: `# Python 3 Solution
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []

# Test execution
print(two_sum([2, 7, 11, 15], 9))
`,
  },
  {
    id: 54,
    name: "C++ (GCC 9.2.0)",
    defaultCode: `// C++ Solution
#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int diff = target - nums[i];
        if (seen.find(diff) != seen.end()) {
            return {seen[diff], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    vector<int> res = twoSum(nums, 9);
    cout << "[" << res[0] << ", " << res[1] << "]" << endl;
    return 0;
}
`,
  },
  {
    id: 62,
    name: "Java (OpenJDK 13.0.1)",
    defaultCode: `// Java Solution
import java.util.*;

public class Main {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int diff = target - nums[i];
            if (seen.containsKey(diff)) {
                return new int[] { seen.get(diff), i };
            }
            seen.put(nums[i], i);
        }
        return new int[] {};
    }

    public static void main(String[] args) {
        int[] res = twoSum(new int[]{2, 7, 11, 15}, 9);
        System.out.println(Arrays.toString(res));
    }
}
`,
  },
  {
    id: 63,
    name: "JavaScript (Node.js 12.14.0)",
    defaultCode: `// JavaScript Solution
function twoSum(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const diff = target - nums[i];
        if (seen.has(diff)) {
            return [seen.get(diff), i];
        }
        seen.set(nums[i], i);
    }
    return [];
}

console.log(twoSum([2, 7, 11, 15], 9));
`,
  },
  {
    id: 60,
    name: "Go (1.13.5)",
    defaultCode: `// Go Solution
package main

import "fmt"

func twoSum(nums []int, target int) []int {
    seen := make(map[int]int)
    for i, num := range nums {
        diff := target - num
        if idx, ok := seen[diff]; ok {
            return []int{idx, i}
        }
        seen[num] = i
    }
    return nil
}

func main() {
    fmt.Println(twoSum([]int{2, 7, 11, 15}, 9))
}
`,
  },
];

export interface ExecutionResult {
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  message?: string | null;
  exit_code?: number | null;
  time?: string | number | null;
  memory?: number | null;
  status?: {
    id: number;
    description: string;
  };
  error?: string;
}

export async function runCodeOnJudge0(
  source_code: string,
  language_id: number,
  stdin: string = ""
): Promise<ExecutionResult> {
  try {
    const res = await fetch("/api/code-execution", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source_code,
        language_id,
        stdin,
      }),
    });

    const data = await res.json();
    return data;
  } catch (error: unknown) {
    console.error("Judge0 execution call failed:", error);
    return {
      error: "Failed to connect to Judge0 execution engine.",
    };
  }
}
