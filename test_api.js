
async function test() {
    console.log("Testing /api/v1/ai/process...");

    // Scenario A: Rewrite
    const payload = {
        action: "REWRITE",
        userInstruction: "Make it punchier",
        context: {
            targetSection: "workExperience",
            targetId: "exp_123",
            data: {
                id: "exp_123",
                company: "Google",
                role: "Intern",
                description: "I did some coding."
            }
        }
    };

    try {
        const response = await fetch('http://127.0.0.1:3000/api/v1/ai/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log("Status:", response.status);
        console.log(JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Test Failed:", err);
    }
}

test().catch(console.error);
