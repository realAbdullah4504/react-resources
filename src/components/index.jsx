import RenderNotes from './RenderNotes';
import AddNotes from './AddNotes';

const ContextComponent = () => {
    return (
        <div className="flex gap-[10px]">
            <AddNotes />
            <RenderNotes/>
        </div>
    )
}

export default ContextComponent
