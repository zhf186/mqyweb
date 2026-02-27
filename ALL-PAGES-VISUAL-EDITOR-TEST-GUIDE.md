# Visual Editor Test Guide - All Pages

## Quick Test Checklist

### Prerequisites
1. ✅ Frontend server running: `npm run dev` (port 3000)
2. ✅ Backend server running: `mvnw.cmd spring-boot:run` (port 8080)
3. ✅ Logged into admin panel: http://localhost:3000/admin/login

---

## Test Each Page

### 1. About Page (关于我们)
**URL**: http://localhost:3000/admin/content → Select "关于我们" → Click "可视化编辑"

**Expected Editable Elements**:
- ✅ Hero background image (`about.hero.background`)
- ✅ Hero title (`about.hero.title`)
- ✅ Hero subtitle (`about.hero.subtitle`)

**Test Steps**:
1. Verify elements are detected (should show "检测到 X 个可编辑元素")
2. Hover over hero title - should show blue overlay
3. Click edit icon on title - TextEditDialog should open
4. Change text and save - should update in preview
5. Click edit icon on background image - ImageEditDialog should open
6. Select a different image - should refresh and show new image

---

### 2. Routes Page (骑行路线)
**URL**: http://localhost:3000/admin/content → Select "骑行路线" → Click "可视化编辑"

**Expected Editable Elements**:
- ✅ Hero background image (`routes.hero.background`)
- ✅ Hero title (`routesPage.heroTitle`)
- ✅ Hero description (`routesPage.heroDesc`)

**Test Steps**:
1. Verify elements are detected
2. Edit hero title text
3. Edit hero description text
4. Replace hero background image
5. Verify all changes appear in preview

---

### 3. E-BIKE Page
**URL**: http://localhost:3000/admin/content → Select "E-BIKE" → Click "可视化编辑"

**Expected Editable Elements**:
- ✅ Hero background image (`ebike.hero.background`)
- ✅ Hero title (`ebikePage.heroTitle`)
- ✅ Hero subtitle (`ebikePage.heroSubtitle`)

**Test Steps**:
1. Verify elements are detected
2. Edit hero title
3. Edit hero subtitle
4. Replace background image
5. Scroll down and verify scroll position is maintained

---

### 4. Goods Page (本地好物)
**URL**: http://localhost:3000/admin/content → Select "本地好物" → Click "可视化编辑"

**Expected Editable Elements**:
- ✅ Hero background image (`goods.hero.background`)
- ✅ Hero title (`goodsPage.heroTitle`)
- ✅ Hero description (`goodsPage.heroDesc`)

**Test Steps**:
1. Verify elements are detected
2. Edit title and description
3. Replace background image
4. Verify changes persist

---

### 5. Community Page (骑友社区)
**URL**: http://localhost:3000/admin/content → Select "骑友社区" → Click "可视化编辑"

**Expected Editable Elements**:
- ✅ Hero background image (`community.hero.background`)
- ✅ Hero title (`communityPage.heroTitle`)
- ✅ Hero description (`communityPage.heroDesc`)

**Test Steps**:
1. Verify elements are detected
2. Edit community title
3. Edit description
4. Replace hero image

---

### 6. Partners Page (合作伙伴)
**URL**: http://localhost:3000/admin/content → Select "合作伙伴" → Click "可视化编辑"

**Expected Editable Elements**:
- ✅ Hero background image (`partners.hero.background`)
- ✅ Hero title (`partnersPage.heroTitle`)
- ✅ Hero description (`partnersPage.heroDesc`)

**Test Steps**:
1. Verify elements are detected
2. Edit partners title
3. Edit description
4. Replace background image

---

## Common Issues & Solutions

### Issue: "未检测到可编辑元素"
**Solution**: 
- Check browser console for errors
- Verify page URL includes `?editMode=true`
- Refresh the iframe
- Check that data-editable attributes are present in the page source

### Issue: Image not updating after selection
**Solution**:
- Wait 1-2 seconds for iframe refresh
- Check that image path is correct
- Verify image exists in asset management

### Issue: Text changes not appearing
**Solution**:
- Check browser console for postMessage errors
- Verify element selector is correct
- Try refreshing the iframe

### Issue: Edit overlays not appearing
**Solution**:
- Scroll the preview iframe to bring elements into view
- Check that elements have proper data-editable attributes
- Verify iframe bridge is working (check console logs)

---

## Success Criteria

All pages should:
- ✅ Detect at least 3 editable elements
- ✅ Show edit overlays on hover
- ✅ Open edit dialogs on click
- ✅ Update content in real-time
- ✅ Maintain scroll position
- ✅ Show update animations
- ✅ No console errors

---

## Browser Console Logs

Expected console messages when opening visual editor:
```
[page.tsx] Edit mode enabled
[page.tsx] Sent IFRAME_READY to parent
[page.tsx] Sent IFRAME_LOADED to parent
[page.tsx] Received message: {type: 'REQUEST_EDITABLE_ELEMENTS'}
[page.tsx] Detecting editable elements...
[page.tsx] Found X editable elements
[page.tsx] Sent EDITABLE_ELEMENTS_RESPONSE to parent
```

When editing content:
```
[page.tsx] Received message: {type: 'UPDATE_CONTENT', payload: {...}}
Content updated: fieldKey content
```

When editing images:
```
[page.tsx] Received message: {type: 'UPDATE_IMAGE', payload: {...}}
[updateElementContent] Image update requested, notifying parent to refresh
Image updated: fieldKey imagePath
```

---

## Performance Notes

- Scroll events are debounced (100ms) for better performance
- Image updates trigger iframe refresh (1-2 second delay)
- Edit mode only activates when `editMode=true` query parameter is present
- Message listeners are properly cleaned up on unmount

---

## Next Steps After Testing

If all tests pass:
1. ✅ Visual editor is fully functional across all pages
2. ✅ Users can edit content on any page
3. ✅ Changes can be saved to CMS database
4. ✅ Ready for production use

If issues are found:
1. Check browser console for specific error messages
2. Verify data-editable attributes are correct
3. Test in different browsers (Chrome, Firefox, Safari)
4. Report any persistent issues with console logs
