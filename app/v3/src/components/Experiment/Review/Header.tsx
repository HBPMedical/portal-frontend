import DropdownModel from "@app/components/UI/DropdownModel";
import { MIP } from "@app/types";
import * as React from "react";
import { Button, Glyphicon, Panel } from "react-bootstrap";

interface IProps {
  handleGoBackToExplore: () => void;
  handleRunAnalysis: () => void;
  handleSaveModel: ({ title } : { title: string }) => void;
  handleSelectModel: (model: MIP.API.IModelResponse) => void;
  modelName?: string;
  models?: MIP.API.IModelResponse[];
  isMock?: boolean;
}
export default class Header extends React.Component<IProps> {
  private input: any;

  constructor(props: IProps) {
    super(props);
    this.input = React.createRef();
  }

  public render() {
    const {
      models,
      modelName,
      isMock,
      handleGoBackToExplore,
      handleRunAnalysis,
      handleSaveModel,
      handleSelectModel
    } = this.props;

    return (
      <Panel>
        <Panel.Body>
          <h3>
            Interactive Analysis on{" "}
            {models && (
              <DropdownModel
                items={models}
                title={modelName}
                handleSelect={handleSelectModel}
              />
            )}
          </h3>
          <div className="actions status">
            <div className="item">
              <Button
                //tslint:disable
                onClick={handleGoBackToExplore}
                bsStyle="info"
                type="submit"
              >
                <Glyphicon glyph="chevron-left" /> Explore
              </Button>
            </div>
            <div className="item text">&nbsp;</div>
            {isMock && (
              <div className="item">
                <input
                  type="text"
                  ref={this.input}
                  className={"form-control"}
                  defaultValue={this.props.modelName}
                />
              </div>
            )}
            {isMock && <div className="item">
              <Button
                //tslint:disable
                onClick={() =>
                  handleSaveModel({title: this.input.current.value})
                }
                // onKeyDown={event => {
                //   if (event.key === "Enter") {
                //     handleRunAnalysis(this.input.current.value);
                //   }
                // }}
                bsStyle="info"
                type="submit"
                // disabled={this.input.current.value === undefined}
              >
                Save model
              </Button>
            </div>
            }
            <div className="item">
              <Button
                //tslint:disable
                onClick={handleRunAnalysis}
                // onKeyDown={event => {
                //   if (event.key === "Enter") {
                //     handleRunAnalysis(this.input.current.value);
                //   }
                // }}
                bsStyle="info"
                type="submit"
                disabled={isMock}
              >
                RUN MACHINE LEARNING EXPERIMENT{" "}
                <Glyphicon glyph="chevron-right" />{" "}
              </Button>
            </div>
          </div>
        </Panel.Body>
      </Panel>
    );
  }

  // private handleChangeModelName = (event: any) => {
  //   this.setState({
  //     modelName: event.target.value
  //   });
  // };
}
