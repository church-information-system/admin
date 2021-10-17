import "./content.scss"

import ContentItem from "./content-item"
import ActionBar from "./action-bar"

export default function Content() {
    return (
        <div id="content">
            <ActionBar />

            <div className="content-container">
                <ContentItem name="Juan Dela Cruz" />
                <ContentItem name="Juan Dela Cruz" />
                <ContentItem name="Juan Dela Cruz" />
                <ContentItem name="Juan Dela Cruz" />
                <ContentItem name="Juan Dela Cruz" />
                <ContentItem name="Juan Dela Cruz" />
                <ContentItem name="Juan Dela Cruz" />
                <ContentItem name="Juan Dela Cruz" />
                <ContentItem name="Juan Dela Cruz" />
                <ContentItem name="Juan Dela Cruz" />
                <ContentItem name="Juan Dela Cruz" />
            </div>

        </div>
    )
}