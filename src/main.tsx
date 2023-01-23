import './index.css';
import Annotation from './index';
import { createRoot } from 'react-dom/client';

function MyComponent() {
    const size = 500;
    const data = [
        {
            color: 'black',
            position: [250, 50],
            radius: 7
        },
        {
            color: 'black',
            position: [250, 200],
            radius: 7
        },
        {
            color: 'black',
            position: [240, 350],
            radius: 7
        },
        {
            color: 'black',
            position: [260, 380],
            radius: 7
        }
    ];

    return (
        <div className="container">
            <svg
                preserveAspectRatio="xMidYMid meet"
                viewBox={`0 0 ${size} ${size}`}
                style={{
                    border: 'solid 1px #ccc',
                    fontFamily: 'sans-serif',
                    width: '100%'
                }}
                xmlns="http://www.w3.org/2000/svg"
            >
                {/** draw all your points */}
                {data.map((d, i) => (
                    <circle
                        key={i}
                        cx={d.position[0]}
                        cy={d.position[1]}
                        r={d.radius}
                        fill={d.color}
                    />
                ))}

                {/** you can annotate a single point */}
                <Annotation
                    dx={30}
                    dy={35}
                    label={'You can annotate a single point'}
                >
                    {/** this shape will not be displayed, it is just to specify the size
                 of the item you want to annotate */}
                    <circle
                        cx={data[0].position[0]}
                        cy={data[0].position[1]}
                        r={data[0].radius}
                    />
                </Annotation>

                <Annotation
                    dx={15}
                    label={'You can also customize styles'}
                    enclosingType="rect"
                    labelStyle={{ color: 'red', textTransform: 'uppercase' }}
                    enclosingStyle={{ stroke: 'red' }}
                    arrowStyle={{ stroke: 'red' }}
                >
                    <circle
                        cx={data[1].position[0]}
                        cy={data[1].position[1]}
                        r={data[1].radius}
                    />
                </Annotation>

                {/** the Annotation component will enclose all its children shapes  */}
                <Annotation
                    dx={-10}
                    dy={-50}
                    label="... and enclose multiple shapes"
                >
                    {data
                        .filter((d) => d.position[1] > 300)
                        .map((d, i) => (
                            <circle
                                key={i}
                                cx={d.position[0]}
                                cy={d.position[1]}
                                r={d.radius}
                            />
                        ))}
                </Annotation>

                <Annotation
                    dx={0}
                    dy={20}
                    label="this is a very long comment on multiple lines"
                >
                    {data
                        .filter((d) => d.position[1] > 300)
                        .map((d, i) => (
                            <circle
                                key={i}
                                cx={d.position[0]}
                                cy={d.position[1]}
                                r={d.radius}
                            />
                        ))}
                </Annotation>
            </svg>
        </div>
    );
}

const rootElement = document.getElementById('root');
const root = createRoot(rootElement as any);

root.render(<MyComponent />);
