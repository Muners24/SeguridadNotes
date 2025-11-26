from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from models.user import UserOut,UserInfo

class NoteIn(BaseModel):
    title: str
    
class IdNote(BaseModel):
    id: str
    
class NoteUpdate(BaseModel):
    id: str
    texts: Optional[List[str]] = None    
    

    
class Note(BaseModel):
    id: str
    owner: UserInfo
    editors: Optional[List[UserInfo]]
    
    title: str
    texts: Optional[List[str]] = None    
    createdAt: datetime
    uploadedAt: datetime

class NoteText(BaseModel):
    text: str
    author: int
    weight: int
"""
class NoteImage(BaseModel):
    id: str
    filename: str
    originalName: Optional[str] = None
    mimeType: Optional[str] = None
    size: Optional[int] = None
    url: Optional[str] = None
    uploadedAt: datetime
    note_id: str
"""