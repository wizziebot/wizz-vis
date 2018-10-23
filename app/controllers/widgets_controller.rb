class WidgetsController < ApplicationController
  before_action :set_dashboard, only: [:index]
  before_action :set_widget, only: %i[show edit update destroy data]

  # GET /widgets
  # GET /widgets.json
  def index
    render json: @dashboard.widgets
  end

  # GET /widgets/1
  # GET /widgets/1.json
  def show
  end

  # GET /widgets/new
  def new
    @widget = Widget.new
  end

  # GET /widgets/1/edit
  def edit
  end

  # POST /widgets
  # POST /widgets.json
  def create
    @widget = Widget.new(widget_params)

    respond_to do |format|
      if @widget.save
        format.html { redirect_to @widget, notice: 'Widget was successfully created.' }
        format.json { render :show, status: :created, location: @widget }
      else
        format.html { render :new }
        format.json { render json: @widget.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /widgets/1
  # PATCH/PUT /widgets/1.json
  def update
    respond_to do |format|
      if @widget.update(widget_params)
        format.html { redirect_to @widget, notice: 'Widget was successfully updated.' }
        format.json { render :show, status: :ok, location: @widget }
      else
        format.html { render :edit }
        format.json { render json: @widget.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /widgets/1
  # DELETE /widgets/1.json
  def destroy
    @widget.destroy
    respond_to do |format|
      format.html { redirect_to widgets_url, notice: 'Widget was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  # Get /widgets/1/data.json
  def data
    @widget.options.merge!(widget_params) if widget_params
    render json: {
      data: @widget.data,
      attributes: WidgetSerializer.new(@widget).as_json
    }
  rescue StandardError => error
    Rails.logger.error "\n#{error} #{error.message}\n"
    Rails.logger.error error.backtrace.join("\n")
    render json: { error: error.message }, status: :unprocessable_entity
  end

  private

  def set_dashboard
    @dashboard = Dashboard.find(params[:dashboard_id])
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_widget
    @widget = Widget.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def widget_params
    params.require(:widget).permit(
      :name, :title, :row, :col, :size_x, :size_y, :dashboard_id,
      :range, :start_time, :end_time
    )
  end
end
