# Visual Editor Image Selector - Testing Guide

## Prerequisites

1. Backend server running (`start-backend.bat`)
2. Frontend server running (`start-frontend.bat`)
3. Logged into admin panel (`/admin/login`)
4. Some images uploaded to asset management for testing

## Test Scenarios

### Scenario 1: Basic Image Selection

**Steps:**
1. Navigate to `/admin/content`
2. Select "首页" (home page) from dropdown
3. Click "预览" button
4. Click "进入编辑模式" in toolbar
5. Click on any image element (e.g., hero background)
6. Verify image edit dialog opens

**Expected Results:**
- ✅ Dialog opens with title "编辑图片"
- ✅ Current image preview shows existing image
- ✅ Image selector section displays with grid of thumbnails
- ✅ Images are filtered by page category (home)
- ✅ Manual input field shows current image path

### Scenario 2: Image Grid Display

**Steps:**
1. Open image edit dialog (follow Scenario 1)
2. Observe the image selector section

**Expected Results:**
- ✅ Images displayed in 4-column grid
- ✅ Each thumbnail shows image preview
- ✅ Filename displayed at bottom of each thumbnail
- ✅ Grid has scrollbar if more than ~8 images
- ✅ Hover effect on thumbnails (blue border)

### Scenario 3: Select Image from Grid

**Steps:**
1. Open image edit dialog
2. Click on any image thumbnail in the grid
3. Observe the changes

**Expected Results:**
- ✅ Selected image has blue border and ring
- ✅ CheckCircle icon appears on selected image
- ✅ Image path auto-fills in input field
- ✅ Selected image info box appears showing:
  - Filename
  - Dimensions (width × height)
  - File size in KB
- ✅ New image preview section appears (if different from current)

### Scenario 4: Save Selected Image

**Steps:**
1. Open image edit dialog
2. Select an image from grid
3. Click "保存" button
4. Wait for save to complete

**Expected Results:**
- ✅ Button shows "保存中..." with spinner
- ✅ Success toast notification appears
- ✅ Dialog closes automatically
- ✅ Preview iframe updates with new image
- ✅ Image displays correctly in preview

### Scenario 5: Manual Path Input

**Steps:**
1. Open image edit dialog
2. Manually type a different image path in input field
3. Observe preview

**Expected Results:**
- ✅ New image preview section appears
- ✅ Preview shows loading spinner initially
- ✅ Preview displays new image when loaded
- ✅ Can save manually entered path
- ✅ Manual input works alongside grid selection

### Scenario 6: Empty State

**Steps:**
1. Create a test page with no images in asset management
2. Open visual editor for that page
3. Click on an image element

**Expected Results:**
- ✅ "该页面暂无可用图片" message displays
- ✅ Image icon shown in empty state
- ✅ "前往图片管理上传" link is visible
- ✅ Clicking link opens asset management in new tab
- ✅ Manual input still works

### Scenario 7: Loading States

**Steps:**
1. Open image edit dialog
2. Observe loading behavior

**Expected Results:**
- ✅ Loading spinner shows while fetching assets
- ✅ Grid appears after assets load
- ✅ No flickering or layout shifts
- ✅ Loading state is smooth and professional

### Scenario 8: Error Handling

**Steps:**
1. Open image edit dialog
2. Manually enter invalid image path
3. Try to save

**Expected Results:**
- ✅ Preview shows error state (red alert icon)
- ✅ Error message: "图片加载失败"
- ✅ Save button disabled when preview has error
- ✅ Error message shown if trying to save invalid path

### Scenario 9: Dialog Layout

**Steps:**
1. Open image edit dialog
2. Observe layout and sizing

**Expected Results:**
- ✅ Dialog is wider (max-w-4xl)
- ✅ Dialog has max height (90vh)
- ✅ Vertical scrollbar appears if content overflows
- ✅ Image grid has internal scrolling (max-h-400px)
- ✅ All sections properly spaced
- ✅ Responsive on different screen sizes

### Scenario 10: Multiple Image Types

**Steps:**
1. Test with different image elements:
   - Hero background image
   - Brand section image
   - Route card images
   - CTA background image

**Expected Results:**
- ✅ All image types can be edited
- ✅ Correct images shown for each page section
- ✅ Category filtering works correctly
- ✅ All images update properly in preview

### Scenario 11: Keyboard Shortcuts

**Steps:**
1. Open image edit dialog
2. Select an image
3. Press Ctrl+S (or Cmd+S on Mac)
4. Open dialog again
5. Press Escape

**Expected Results:**
- ✅ Ctrl+S saves the image
- ✅ Escape closes the dialog
- ✅ Shortcuts work consistently

### Scenario 12: Image Auto-Adaptation

**Steps:**
1. Select an image with different dimensions than current
2. Save the image
3. Observe how it displays in preview

**Expected Results:**
- ✅ Image automatically fits container
- ✅ Aspect ratio maintained (object-cover)
- ✅ No distortion or stretching
- ✅ Responsive sizing works on different devices
- ✅ Image looks good on desktop, tablet, mobile views

## Edge Cases to Test

### Edge Case 1: Very Large Image Library
- Test with 50+ images in a category
- Verify scrolling works smoothly
- Check performance of grid rendering

### Edge Case 2: Very Long Filenames
- Test with images that have long filenames
- Verify truncation works in grid
- Check that full name shows in info box

### Edge Case 3: Different Image Formats
- Test with JPG, PNG, GIF, WebP, SVG
- Verify all formats display correctly
- Check that all formats can be saved

### Edge Case 4: Network Delays
- Test with slow network (throttle in DevTools)
- Verify loading states appear
- Check that UI remains responsive

### Edge Case 5: Rapid Clicking
- Rapidly click different thumbnails
- Verify selection updates correctly
- Check for any race conditions

## Browser Compatibility

Test in:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## Performance Checks

- ✅ Asset API call completes in < 2 seconds
- ✅ Grid renders smoothly with 20+ images
- ✅ No memory leaks when opening/closing dialog multiple times
- ✅ Smooth scrolling in image grid
- ✅ No layout shifts during loading

## Accessibility Checks

- ✅ Keyboard navigation works
- ✅ Focus states visible
- ✅ Screen reader friendly (alt text, labels)
- ✅ Color contrast sufficient
- ✅ Interactive elements have proper hover states

## Known Limitations

1. **Category Filtering**: Images must be uploaded with correct category to appear
2. **Pagination**: Currently shows all images (no pagination in grid)
3. **Search**: No search/filter within image grid yet
4. **Upload**: Cannot upload new images directly from dialog

## Troubleshooting

### Issue: No images showing in grid
**Solution**: 
- Check that images are uploaded with correct category
- Verify pageSlug matches asset category
- Check browser console for API errors

### Issue: Images not loading
**Solution**:
- Verify image URLs are correct
- Check CORS settings
- Ensure backend is serving images correctly

### Issue: Save fails
**Solution**:
- Check authentication token is valid
- Verify content item exists in database
- Check browser console for errors

### Issue: Preview doesn't update
**Solution**:
- Check iframe communication (postMessage)
- Verify UPDATE_IMAGE message is sent
- Refresh preview iframe if needed

## Success Criteria

All scenarios should pass with:
- ✅ No console errors
- ✅ No TypeScript errors
- ✅ Smooth user experience
- ✅ Correct data persistence
- ✅ Proper error handling
- ✅ Good performance

## Reporting Issues

If you find any issues, please report:
1. Scenario/step where issue occurred
2. Expected vs actual behavior
3. Browser and version
4. Console errors (if any)
5. Screenshots/video if possible

---

**Test Guide Version**: 1.0
**Last Updated**: 2026-02-14
**Feature**: Visual Editor Image Selector Enhancement
