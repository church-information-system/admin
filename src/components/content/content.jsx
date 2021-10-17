import "./content.scss"

import ContentItem from "./content-item"
import ActionBar from "./action-bar"

export default function Content() {
    return (
        <div id="content">
            <ActionBar />

            <div class="content-container">
                <ContentItem />
                <ContentItem />
                <ContentItem />
                <ContentItem />
                <ContentItem />
                <ContentItem />
                <ContentItem />
                <ContentItem />
                <ContentItem />
                <ContentItem />
                <ContentItem />
                <ContentItem />
                <ContentItem />
                <ContentItem />
                <ContentItem />
            </div>

        </div>
    )
}