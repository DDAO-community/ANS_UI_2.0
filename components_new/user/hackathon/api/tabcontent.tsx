import { Res, Transaction } from "../../../../src/types";
import { LoadingOrNotFound } from "../../components/reusables";
import { mockData } from "./mockData";

// Check out tabcontent file for more info and examples

export function HackathonTabs(arkProfile: Res | undefined, loading: boolean) {
    // Tabs are an array of objects, unlike widgets which are an array of components
    // Each object has title, total, and component properties.
    // title is the title of the tab, and total is the total number of items in the tab.
    // component is the component that will be rendered within the tab.
    // If you want to render a component determined by a condition, you can use a simple ternary operator

    let i = 0;
    const handles = arkProfile?.CROSSBELL_HANDLES.map((h) => h.handle);
    console.log(arkProfile?.CROSSBELL_HANDLES);
    // Notice: RSS3 hasn't supported indexing the character notes posted by the operator.
    // So here we use the mock data, with the same interface with the RSS3 API though.
    // When RSS3 supported this feature, we could switch the following code with:
    // ```
    // const rawData = arkProfile?.RSS3.transactions || []
    // ```
    const rawData = mockData as Transaction[];
    const notes = [];
    for (const tx of rawData) {
        const authorUrls = tx.actions[0].metadata?.author || [];
        const authorUrl = authorUrls[0];
        if (
            tx.network === "crossbell" &&
            tx.platform === "cori" &&
            handles?.find((h) => "https://crossbell.io/@" + h === authorUrl)
        ) {
            i++;
            notes.push(tx.actions[0]);
        }
    }

    console.log(i);
    return [
        {
            name: "dAgora",
            total: i,
            component:
                i > 0 ? (
                    <NoteCardsSection notes={notes} />
                ) : (
                    <LoadingOrNotFound
                        loading={loading}
                        jsxNotFound={"No notes found"}
                    />
                ),
        },
    ];
}

export function NoteCardsSection(props: { notes: any[] }) {
    return (
        <div>
            <div className="grid grid-cols-3">
                {props.notes.map((note, index) => (
                    <a target="_blank" href={note.related_urls[1]}>
                        <div className="note-card" key={index}>
                            <h1 className="text-center title">
                                {note.metadata.title}
                            </h1>
                            <p>{note.metadata.body}</p>
                            <div className="tags">
                                {(note.metadata.tags || []).map(
                                    (tag: string, tagIndex: number) => (
                                        <span className="tag" key={tagIndex}>
                                            {tag}
                                        </span>
                                    )
                                )}
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
