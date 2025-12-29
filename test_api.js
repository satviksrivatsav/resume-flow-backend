
async function test() {
    // node 18+ has native fetch
    const response = await fetch('http://localhost:3000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            messages: [{ role: 'user', content: 'Rewrite this to be more impact driven.' }],
            context: {
                workExperience: [{ id: '1', company: 'Google', description: 'Did backend work.' }]
            },
            action: 'rewrite'
        })
    });

    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
}

test().catch(console.error);
