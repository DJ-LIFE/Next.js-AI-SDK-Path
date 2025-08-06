"use client"

import { useState } from "react";

export default function CompletionPage() {
	const [prompt, setPrompt] = useState<string>("");
	const [completion, setCompletion] = useState<string>("");
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		setLoading(true);
		setPrompt("");

		try {
			const response = await fetch("/api/completion", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ prompt }),
			})

			if (!response.ok) {
				console.error('Response status:', response.status);
				const errorText = await response.text();
				console.error('Error response:', errorText);
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			setCompletion(data.text);
		} catch (error) {
			console.error('Error calling API:', error);
			setCompletion('Error: Failed to generate completion');
		} finally {
			setLoading(false);
		}
	}
	return (
		<div className="flex flex-col w-full h-screen mx-auto p-4 bg-zinc-200">
			{
				loading ? (
					<div className="flex items-center justify-center h-full">
						<p className="text-lg text-gray-700">Loading...</p>
					</div>
				) : (
					<div className="flex-1 overflow-y-auto p-4 bg-white rounded-lg shadow-md">
						<p className="text-lg text-gray-800">{completion}</p>
					</div>
				)
			}
			<form className="flex gap-2 fixed bottom-10 w-full p-2" onSubmit={handleSubmit}>
				<div className="mx-auto">
					<input placeholder="How can i help You"
					value={prompt}
					onChange={e => setPrompt(e.target.value)}
					type="text"
						className="flex-1 dark:bg-zinc-800 p-2 pl-4 border-zinc-300 dark:border-zinc-100 rounded-l-lg"
					/>
					<button type="submit" className="py-2 px-4 bg-blue-500 text-white hover:bg-blue-600 rounded-r-lg">Send</button>
				</div>
			</form>
		</div>
	)
}