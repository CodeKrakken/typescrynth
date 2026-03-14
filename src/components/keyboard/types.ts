export interface CustomTouchEvent extends TouchEvent {
  explicitOriginalTarget: {
    innerText: string
  }
}