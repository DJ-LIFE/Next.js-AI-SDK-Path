"use client"

import { useCompletion } from "@ai-sdk/react";

export default function StreamPage() {
	const { input, handleInputChange, handleSubmit, completion, isLoading, error, setInput, stop } = useCompletion({
		api: "/api/stream",
	});

	return (
		<div className="flex flex-col w-full h-screen mx-auto p-4">
			<div className="flex-1 w-full max-w-4xl mx-auto p-4 mb-20 overflow-y-auto border border-neutral-500 rounded-xl">
				{error && <div className="text-red-500 mb-4 text-sm">Error: {error.message}</div>}
				{isLoading && !completion && <div>Loading...</div>}
				{completion && <div>{completion}</div>}
			</div>
			<form className="flex gap-2 fixed bottom-10 w-full p-2" onSubmit={(e) => {
				e.preventDefault();
				setInput("");
				handleSubmit(e);
			}}>
				<div className="mx-auto">
					<input placeholder="Ask me anything..."
						value={input}
						onChange={handleInputChange}
						type="text"
						className="flex-1 dark:bg-zinc-800 p-2 pl-4 border-zinc-300 dark:border-zinc-100 rounded-l-lg"
					/>
					{isLoading ? <button onClick={stop} className="cursor-pointer py-2 px-4 bg-red-500 text-white rounded-r-lg">Stop</button>
						:
						<button
							disabled={isLoading}
							type="submit"
							className="py-2 px-4 bg-blue-500 text-white hover:bg-blue-600 rounded-r-lg"
						>
							Send
						</button>
					}
				</div>
			</form>
		</div>
	)
}