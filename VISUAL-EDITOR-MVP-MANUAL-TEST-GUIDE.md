# Visual Editor MVP - Manual Testing Guide

## Prerequisites

✅ **Both servers are running**:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080

## Quick Test Procedure (5 minutes)

### Test 1: Navigate to Visual Editor ⏱️ 1 min

1. Open browser: http://localhost:3000/admin/content
2. Login if needed (use admin credentials)
3. Select "首页 (Home)" from the page dropdown
4. Click the **"可视化编辑"** button

**✅ Expected**: You should be redirected to `/admin/visual-editor/home` with a toolbar at the top and an iframe preview below.

---

### Test 2: Enter Edit Mode ⏱️ 1 min

1. In the visual editor, click the **"进入编辑模式"** button in the toolbar
2. Wait 1-2 seconds

**✅ Expected**: 
- Button changes to "退出编辑模式"
- Toast notification: "检测到 X 个可编辑元素"
- You should see blue borders appear when hovering over text/images in the preview

---

### Test 3: Edit Text Content ⏱️ 1 min

1. Hover over any text element (e.g., the brand name "漫骑游")
2. You should see a blue border and a label showing the field name
3. Click on the text element
4. A dialog should open with Chinese and English input fields
5. Modify the Chinese text (e.g., change "漫骑游" to "漫骑游测试")
6. Click **"保存"** button

**✅ Expected**:
- Dialog closes
- Toast: "保存成功"
- The text in the preview updates immediately (without page reload)

---

### Test 4: Edit Image ⏱️ 1 min

1. Hover over any image element (e.g., hero background image)
2. You should see a blue border and an image icon label
3. Click on the image
4. A dialog should open showing the current image and path input
5. Try changing the path to another image (e.g., `/brand_assets/hero/page1_img1.jpeg`)
6. You should see the new image preview in the dialog
7. Click **"保存"** button

**✅ Expected**:
- Dialog closes
- Toast: "图片已更新"
- The image in the preview updates immediately

---

### Test 5: Device Size Switching ⏱️ 30 sec

1. In the toolbar, find the device size selector (Desktop/Tablet/Mobile icons)
2. Click **Tablet** icon
3. Click **Mobile** icon
4. Click **Desktop** icon

**✅ Expected**:
- Preview iframe resizes smoothly
- Tablet: 768px width
- Mobile: 375px width
- Desktop: Full width
- Edit mode remains active during switches

---

### Test 6: Language Switching ⏱️ 30 sec

1. In the toolbar, click the **"中/EN"** language toggle button
2. Observe the preview content

**✅ Expected**:
- Toast: "语言已切换"
- Preview content changes to English
- Click again to switch back to Chinese

---

## Troubleshooting

### Issue: "预览加载失败"
**Solution**: 
- Check that frontend is running on port 3000
- Check browser console for errors
- Try refreshing the page

### Issue: "检测到 0 个可编辑元素"
**Solution**:
- Make sure you're on the home page (`/admin/visual-editor/home`)
- Check that `frontend/src/app/page.tsx` has `data-editable` attributes
- Check browser console for errors

### Issue: "保存失败"
**Solution**:
- Check that backend is running on port 8080
- Check that you're logged in (JWT token valid)
- Check browser network tab for API errors
- Check backend console for errors

### Issue: Preview doesn't update after save
**Solution**:
- This is expected if the frontend page doesn't have full postMessage handler
- Refresh the visual editor page to see the saved changes
- This will be improved in Phase 2

---

## What to Look For

### ✅ Good Signs
- Smooth transitions between modes
- Clear visual feedback (toasts, highlights)
- Immediate preview updates
- No console errors
- Responsive toolbar and dialogs

### ⚠️ Warning Signs
- Console errors (red text in browser DevTools)
- Network errors (check Network tab)
- Slow loading (> 3 seconds)
- Elements not highlighting
- Save operations failing

---

## Browser DevTools Tips

### Open DevTools
- Press `F12` or `Ctrl+Shift+I` (Windows)
- Press `Cmd+Option+I` (Mac)

### Check Console
- Look for errors (red text)
- Look for our debug messages (blue text)

### Check Network
- Filter by "XHR" to see API calls
- Look for failed requests (red status codes)

### Check Application Storage
- Check localStorage for JWT token
- Should have `adminToken` key

---

## Test Results Template

Copy this and fill in your results:

```
## My Test Results

Date: ___________
Browser: ___________

- [ ] Test 1: Navigate to Visual Editor - PASS / FAIL
- [ ] Test 2: Enter Edit Mode - PASS / FAIL
- [ ] Test 3: Edit Text Content - PASS / FAIL
- [ ] Test 4: Edit Image - PASS / FAIL
- [ ] Test 5: Device Size Switching - PASS / FAIL
- [ ] Test 6: Language Switching - PASS / FAIL

Issues Found:
1. ___________
2. ___________

Overall: PASS / FAIL
```

---

## Need Help?

If you encounter any issues:
1. Check the console for error messages
2. Check the test results document: `VISUAL-EDITOR-MVP-TEST-RESULTS.md`
3. Review the implementation in the component files
4. Ask for assistance with specific error messages

---

**Happy Testing! 🎉**
